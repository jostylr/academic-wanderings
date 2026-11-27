import test from "node:test";
import assert from "node:assert/strict";
import { det2, flowMatrix, flowState, focusState } from "../docs/transport-models.mjs";

const close = (actual, expected, tolerance = 2e-11) =>
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} differs from ${expected}`);
const closeMatrix = (actual, expected, tolerance) => actual.forEach((row, i) => row.forEach((value, j) => close(value, expected[i][j], tolerance)));

// Independent series for exp(tB), with ordinary matrix multiplication.
// This does not use the closed triangular formula or sinhc in the application.
function exponentialSeries(matrix, t) {
  const result = [[1, 0], [0, 1]];
  let term = [[1, 0], [0, 1]];
  for (let order = 1; order <= 45; order++) {
    term = term.map(row => [0, 1].map(j => (row[0] * matrix[0][j] + row[1] * matrix[1][j]) * t / order));
    result.forEach((row, i) => row.forEach((_, j) => { result[i][j] += term[i][j]; }));
  }
  return result;
}

const velocityMatrix = ({ d, s, k }) => [[d + s, k], [0, d - s]];

test("the exact flow matches an independent matrix exponential across controls and zero-strain limits", () => {
  for (const d of [-0.4, 0, 0.4]) for (const s of [-0.5, -1e-10, 0, 1e-10, 0.5]) {
    for (const k of [-1.5, 0, 1.5]) for (const t of [0, 0.05, 1, 1.5]) {
      const parameters = { d, s, k, t };
      closeMatrix(flowMatrix(parameters), exponentialSeries(velocityMatrix(parameters), t));
    }
  }
  closeMatrix(flowMatrix({ d: 0, s: 0, k: 1, t: 1 }), [[1, 1], [0, 1]]);
});

test("the variational equation F' = BF and its initial condition hold", () => {
  for (const parameters of [
    { d: 0.2, s: 0.4, k: 0.8, t: 1 },
    { d: -0.4, s: -0.5, k: -1.5, t: 1.5 },
    { d: 0, s: 0, k: 1.5, t: 0.5 },
  ]) {
    closeMatrix(flowMatrix({ ...parameters, t: 0 }), [[1, 0], [0, 1]]);
    const step = 1e-5;
    const plus = flowMatrix({ ...parameters, t: parameters.t + step });
    const minus = flowMatrix({ ...parameters, t: parameters.t - step });
    const derivative = plus.map((row, i) => row.map((value, j) => (value - minus[i][j]) / (2 * step)));
    const matrix = flowMatrix(parameters), b = velocityMatrix(parameters);
    const bf = b.map(row => [0, 1].map(j => row[0] * matrix[0][j] + row[1] * matrix[1][j]));
    closeMatrix(derivative, bf, 2e-9);
  }
});

test("shoelace area, trace prediction, and transported mass agree independently", () => {
  for (const d of [-0.4, 0, 0.4]) for (const s of [-0.5, 0, 0.5]) for (const k of [-1.5, 0, 1.5]) {
    const state = flowState({ d, s, k, t: 1.5 });
    const polygon = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]].map(([x, y]) =>
      state.matrix.map(row => row[0] * x + row[1] * y));
    const area = Math.abs(polygon.reduce((sum, [x, y], i) => {
      const next = polygon[(i + 1) % polygon.length];
      return sum + x * next[1] - y * next[0];
    }, 0)) / 2;
    close(state.jacobian, area);
    close(area, Math.exp(3 * d));
    close(state.predictedJacobian, area);
    close(state.density * area, 1);
    close(state.mass, 1);
    if (d === 0) close(area, 1);
  }
});

test("the chain rule composes half-step derivatives and their volume scales", () => {
  const parameters = { d: 0.2, s: -0.3, k: 1.2, t: 1.5 };
  const state = flowState(parameters);
  closeMatrix(state.composedHalfSteps, exponentialSeries(velocityMatrix(parameters), parameters.t));
  close(state.halfJacobianProduct, state.jacobian);
  const shear = [[1, 1], [0, 1]], stretch = [[2, 0], [0, 1]];
  // Independently specified products from the review: same area, different shape.
  close(det2(shear) * det2(stretch), det2([[2, 2], [0, 1]]));
  close(det2([[2, 2], [0, 1]]), det2([[2, 1], [0, 1]]));
});

test("a forward-Euler step with zero trace need not preserve finite-step area", () => {
  const s = 0.5;
  const area = h => det2([[1 + h * s, 0], [0, 1 - h * s]]);
  close(area(0.2), 1 - 0.2 ** 2 * s ** 2);
  assert.ok(area(0.2) < 1);
  const coarse = area(0.2) ** 5;
  const fine = area(0.1) ** 10;
  assert.ok(Math.abs(1 - fine) < Math.abs(1 - coarse));
  close(det2(flowMatrix({ d: 0, s, k: 0, t: 1 })), 1);
});

test("the focus distinguishes signed Jacobian, positive length, and undefined inverse quantities", () => {
  close(focusState(0).densityRatio, 1);
  close(focusState(0.5).densityRatio, 2);
  const at = focusState(1);
  assert.equal(at.stage, "at");
  assert.equal(at.singular, true);
  assert.equal(at.jacobian, 0);
  for (const field of ["densityRatio", "velocityGradient", "actionCoefficient"]) assert.equal(at[field], null);
  const near = focusState(1 - 1e-13);
  assert.equal(near.singular, false);
  assert.equal(near.stage, "before");
  assert.ok(Number.isFinite(near.densityRatio) && near.densityRatio > 1e12);
  const after = focusState(1.5);
  assert.equal(after.stage, "after");
  close(after.jacobian, -0.5);
  close(after.length, 0.5);
  close(after.densityRatio, 2);
  close(after.velocityGradient, 2);
  for (const t of [0, 0.5, 0.99, 1.01, 1.5]) {
    const step = 1e-5;
    close((focusState(t + step).jacobian - focusState(t - step).jacobian) / (2 * step), -1, 1e-9);
  }
});

test("the focusing action obeys Hamilton–Jacobi, endpoint momentum, and the action integral", () => {
  const action = (x, t) => focusState(t).actionCoefficient * x * x;
  for (const t of [0, 0.2, 0.8, 1.2, 1.5]) for (const a of [-0.7, 0, 0.4]) {
    const x = focusState(t).jacobian * a;
    const h = 1e-5;
    const gradient = (action(x + h, t) - action(x - h, t)) / (2 * h);
    const timeDerivative = (action(x, t + h) - action(x, t - h)) / (2 * h);
    close(gradient, -a, 1e-9);
    close(timeDerivative + gradient * gradient / 2, 0, 1e-8);
    close(action(x, t), -a * a / 2 + t * a * a / 2);
  }
});

test("the reviewed free Gaussian conserves probability and solves the continuity equation", () => {
  const density = (x, t) => Math.exp(-x * x / (1 + t * t)) / Math.sqrt(Math.PI * (1 + t * t));
  const velocity = (x, t) => x * t / (1 + t * t);
  for (const t of [0, 0.5, 2]) {
    const width = Math.sqrt(1 + t * t);
    const count = 2000, dx = 16 * width / count;
    let integral = 0;
    for (let i = 0; i <= count; i++) integral += (i === 0 || i === count ? 1 : i % 2 ? 4 : 2) * density(-8 * width + i * dx, t);
    close(integral * dx / 3, 1, 1e-10);
    for (const a of [-1, 0, 0.7]) {
      const x = width * a, h = 1e-5;
      close(density(x, t) * width, density(a, 0));
      const dt = (density(x, t + h) - density(x, t - h)) / (2 * h);
      const flux = q => density(q, t) * velocity(q, t);
      const derivative = (flux(x + h) - flux(x - h)) / (2 * h);
      close(dt + derivative, 0, 1e-8);
    }
  }
});
