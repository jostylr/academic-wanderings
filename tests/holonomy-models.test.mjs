import test from "node:test";
import assert from "node:assert/strict";
import { circleWave, circleState } from "../docs/holonomy-models.mjs";

const tau = 2 * Math.PI;
const add = (a, b) => a.map((x, i) => x + b[i]);
const scale = (a, s) => a.map(x => x * s);
const sub = (a, b) => add(a, scale(b, -1));
const mul = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
const cis = x => [Math.cos(x), Math.sin(x)];
const abs2 = ([x, y]) => x * x + y * y;
const imagInner = ([x, y], [u, v]) => x * v - y * u;
function near(actual, expected, tolerance = 2e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≠ ${expected}`);
}
function nearVector(actual, expected, tolerance) {
  actual.forEach((value, i) => near(value, expected[i], tolerance));
}
const derivative = (f, x, h = 1e-5) => scale(sub(f(x + h), f(x - h)), 1 / (2 * h));
const secondDerivative = (f, x, h = 2e-4) =>
  scale(sub(add(f(x + h), f(x - h)), scale(f(x), 2)), 1 / h ** 2);

test("circle wave and derivative obey twisted seam conditions at arbitrary cuts", () => {
  for (const alpha of [0, 0.25, 0.5, 1]) for (const n of [-3, 0, 3]) {
    for (const radius of [0.5, 1, 2]) for (const seam of [-1.3, 0, 4.2]) {
      const params = { alpha, n, radius, time: 0.7 };
      const left = circleWave(seam, params), right = circleWave(seam + tau, params);
      const phase = cis(tau * alpha);
      nearVector(right.cover, mul(phase, left.cover));
      nearVector(right.coverDerivative, mul(phase, left.coverDerivative));
      nearVector(right.periodic, left.periodic);
      nearVector(right.covariantDerivative, left.covariantDerivative);
      const other = circleWave(seam, { ...params, n: n + 1 });
      const otherRight = circleWave(seam + tau, { ...params, n: n + 1 });
      // Imaginary part of the boundary form for two different modes cancels.
      const boundary = (u, v) => imagInner(u.cover, v.coverDerivative)
        - imagInner(u.coverDerivative, v.cover);
      near(boundary(right, otherRight) - boundary(left, other), 0);
    }
  }
});

test("finite differences check the wave PDE and the connection change, including its sign", () => {
  for (const alpha of [0, 0.25, 0.5, 1]) for (const n of [-3, 0, 2]) {
    for (const radius of [0.5, 1.7]) {
      const params = { alpha, n, radius, time: 0.63 }, theta = 1.1;
      const wave = circleWave(theta, params);
      const coverD = derivative(x => circleWave(x, params).cover, theta);
      const periodicD = derivative(x => circleWave(x, params).periodic, theta);
      const covD = add(periodicD, mul([0, alpha], wave.periodic));
      nearVector(wave.periodic, mul(cis(-alpha * theta), wave.cover));
      nearVector(covD, mul(cis(-alpha * theta), coverD), 3e-9);
      nearVector(covD, wave.covariantDerivative, 3e-9);
      const laplacian = scale(secondDerivative(x => circleWave(x, params).cover, theta), 1 / radius ** 2);
      const timeD = derivative(t => circleWave(theta, { ...params, time: t }).cover, params.time);
      nearVector(mul([0, 1], timeD), scale(laplacian, -0.5), 8e-7);
      near(imagInner(wave.cover, coverD) / abs2(wave.cover), n + alpha, 2e-9);
    }
  }
});

test("circle probabilities, phase holonomy, sector relabeling, and radius scaling agree", () => {
  for (const alpha of [0, 0.25, 0.5, 1]) for (const n of [-3, 0, 3]) {
    const params = { alpha, n, radius: 0.7, time: 2.3 };
    const a = circleState(params);
    near(a.probability, 1);
    near(a.density * tau * params.radius, 1);
    near(a.coverVelocity, a.connectionVelocity);
    near(a.arcSpeed, params.radius * a.coverVelocity);
    nearVector(mul(a.twist, a.holonomy), [1, 0]);
    // Solve parallel transport Dχ = 0 by Euler steps: χ' = -iαχ.
    let transport = [1, 0];
    const steps = 20000;
    for (let k = 0; k < steps; k++) transport = add(transport, scale(mul([0, -alpha], transport), tau / steps));
    nearVector(transport, a.holonomy, 0.0011);
    const relabeled = circleState({ ...params, alpha: alpha + 1, n: n - 1 });
    near(relabeled.energy, a.energy);
    near(relabeled.coverVelocity, a.coverVelocity);
    nearVector(relabeled.point, a.point);
    const bigger = circleState({ ...params, radius: 2 * params.radius });
    near(bigger.energy * 4, a.energy);
    near(bigger.coverVelocity * 4, a.coverVelocity);
    near(bigger.arcSpeed * 2, a.arcSpeed);
  }
});

test("moving the seam changes a coordinate label while preserving the physical state", () => {
  const params = { alpha: 0.25, n: -2, radius: 1.4, time: 3.6 };
  const initial = circleState(params);
  for (const seamDegrees of [90, 180, 270]) {
    const moved = circleState({ ...params, seamDegrees });
    for (const key of ["energy", "density", "coverVelocity", "connectionVelocity", "angle"]) near(moved[key], initial[key]);
    nearVector(moved.point, initial.point);
    nearVector(cis(moved.seamAngle), mul(cis(-seamDegrees * Math.PI / 180), cis(initial.angle)));
  }
});

test("the sphere mode has unit norm and solves the metric Laplacian and guiding equations", () => {
  for (const radius of [0.7, 1, 2]) {
    const amplitude = Math.sqrt(3 / (8 * Math.PI * radius ** 2));
    const psi = (theta, phi) => scale(cis(phi), amplitude * Math.sin(theta));
    // Independent composite Simpson integral with the geometric area measure.
    const count = 1000, step = Math.PI / count;
    let integral = 0;
    for (let i = 0; i <= count; i++) {
      const theta = i * step;
      const weight = i === 0 || i === count ? 1 : i % 2 ? 4 : 2;
      integral += weight * abs2(psi(theta, 0)) * radius ** 2 * Math.sin(theta) * tau;
    }
    near(integral * step / 3, 1, 5e-11);
    for (const theta of [0.2, 0.8, 1.7, 2.9]) {
      const phi = 0.7, wave = psi(theta, phi);
      const thetaD = derivative(t => psi(t, phi), theta);
      const phiD = derivative(p => psi(theta, p), phi);
      const laplacian = scale(add(add(secondDerivative(t => psi(t, phi), theta),
        scale(thetaD, Math.cos(theta) / Math.sin(theta))),
      scale(secondDerivative(p => psi(theta, p), phi), 1 / Math.sin(theta) ** 2)), 1 / radius ** 2);
      nearVector(laplacian, scale(wave, -2 / radius ** 2), 2e-6);
      near(imagInner(wave, thetaD) / (radius ** 2 * abs2(wave)), 0);
      const angularVelocity = imagInner(wave, phiD) / (radius ** 2 * Math.sin(theta) ** 2 * abs2(wave));
      near(angularVelocity, 1 / (radius ** 2 * Math.sin(theta) ** 2), 3e-9);
      near(radius * Math.sin(theta) * angularVelocity, 1 / (radius * Math.sin(theta)), 3e-9);
    }
    near(abs2(psi(0, 0)), 0);
    near(abs2(psi(Math.PI, 0)), 0);
  }
});

// A real, position-dependent unitary frame, acting on two complex components.
const apply = (matrix, vector) => matrix.map(row => row.reduce((sum, entry, i) => add(sum, mul(entry, vector[i])), [0, 0]));
const matrixProduct = (a, b) => a.map(row => b[0].map((_, j) =>
  row.reduce((sum, entry, k) => add(sum, mul(entry, b[k][j])), [0, 0])));
const matrixSub = (a, b) => a.map((row, i) => row.map((entry, j) => sub(entry, b[i][j])));
const rotation = q => [[Math.cos(q), -Math.sin(q)], [Math.sin(q), Math.cos(q)]].map(row => row.map(x => [x, 0]));
const vectorAdd = (a, b) => a.map((z, i) => add(z, b[i]));
const norm = vector => vector.reduce((sum, z) => sum + abs2(z), 0);
const current = (psi, dpsi) => psi.reduce((sum, z, i) => sum + imagInner(z, dpsi[i]), 0);

test("a varying unitary frame preserves the covariant derivative, density, and current", () => {
  const connection = [[[0, 0.3], [0.4, 0]], [[-0.4, 0], [0, -0.3]]];
  const rotationGenerator = [[[0, 0], [-1, 0]], [[1, 0], [0, 0]]];
  const psi = q => [cis(q), scale(cis(-2 * q), 1 + q)];
  const dpsi = q => [mul([0, 1], cis(q)), mul([1, -2 * (1 + q)], cis(-2 * q))];
  for (const q of [-0.3, 0, 0.8, 2]) {
    const unitary = rotation(q);
    const transformedConnection = matrixSub(matrixProduct(matrixProduct(unitary, connection), rotation(-q)), rotationGenerator);
    const transformedPsi = x => apply(rotation(x), psi(x));
    const frameDerivative = [0, 1].map(i => derivative(x => transformedPsi(x)[i], q));
    const covD = vectorAdd(dpsi(q), apply(connection, psi(q)));
    const transformedCovD = vectorAdd(frameDerivative, apply(transformedConnection, transformedPsi(q)));
    const expected = apply(unitary, covD);
    transformedCovD.forEach((z, i) => nearVector(z, expected[i], 3e-9));
    near(norm(transformedPsi(q)), norm(psi(q)));
    near(current(transformedPsi(q), transformedCovD), current(psi(q), covD), 2e-8);
  }
});

test("a noncommuting potential obstructs a proposed matrix periodicity sector", () => {
  const sigmaX = [[[0, 0], [1, 0]], [[1, 0], [0, 0]]];
  const sigmaZ = [[[1, 0], [0, 0]], [[0, 0], [-1, 0]]];
  const scalarPotential = [[[2, 0], [0, 0]], [[0, 0], [2, 0]]];
  const commutator = (a, b) => matrixSub(matrixProduct(a, b), matrixProduct(b, a));
  assert.ok(commutator(sigmaX, sigmaZ).flat().some(z => abs2(z) > 0));
  for (const z of commutator(sigmaX, scalarPotential).flat()) near(abs2(z), 0);
  const wave = [[1, 0], [0, 0]];
  assert.notDeepEqual(apply(sigmaZ, apply(sigmaX, wave)), apply(sigmaX, apply(sigmaZ, wave)));
});
