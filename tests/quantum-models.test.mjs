import test from "node:test";
import assert from "node:assert/strict";
import { spinState, diracState } from "../docs/quantum-models.mjs";

// Independent complex matrix calculations: [real, imaginary] entries.
const c = (real, imaginary = 0) => [real, imaginary];
const add = ([a, b], [d, e]) => c(a + d, b + e);
const mul = ([a, b], [d, e]) => c(a * d - b * e, a * e + b * d);
const conjugate = ([a, b]) => c(a, -b);
const norm2 = vector => vector.reduce((sum, [a, b]) => sum + a * a + b * b, 0);
const apply = (matrix, vector) => matrix.map(row => row.reduce((sum, value, i) => add(sum, mul(value, vector[i])), c(0)));
const expectation = (matrix, vector) => apply(matrix, vector)
  .reduce((sum, value, i) => add(sum, mul(conjugate(vector[i]), value)), c(0));
const product = (a, b) => a.map(row => b[0].map((_, j) => row
  .reduce((sum, value, k) => add(sum, mul(value, b[k][j])), c(0))));
const close = (actual, expected, tolerance = 2e-12) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} differs from ${expected}`);
const sigma = [
  [[c(0), c(1)], [c(1), c(0)]],
  [[c(0), c(0, -1)], [c(0, 1), c(0)]],
  [[c(1), c(0)], [c(0), c(-1)]],
];
const beta = Array.from({ length: 4 }, (_, i) => Array.from({ length: 4 }, (_, j) => c(i === j ? i < 2 ? 1 : -1 : 0)));
const alpha = sigma.map(matrix => Array.from({ length: 4 }, (_, i) => Array.from({ length: 4 }, (_, j) =>
  (i < 2) === (j < 2) ? c(0) : matrix[i % 2][j % 2])));
const gamma = [beta, ...alpha.map(matrix => product(beta, matrix))];

test("Pauli and Dirac matrices obey the stated Clifford signs and factors", () => {
  for (const [matrices, signature] of [[sigma, [1, 1, 1]], [gamma, [1, -1, -1, -1]]]) {
    for (let i = 0; i < matrices.length; i++) for (let j = 0; j < matrices.length; j++) {
      const ab = product(matrices[i], matrices[j]);
      const ba = product(matrices[j], matrices[i]);
      for (let row = 0; row < ab.length; row++) for (let col = 0; col < ab.length; col++) {
        const value = add(ab[row][col], ba[row][col]);
        close(value[0], i === j && row === col ? 2 * signature[i] : 0);
        close(value[1], 0);
      }
    }
  }
});

test("spin analyzer probabilities agree with the Pauli projector", () => {
  for (const rotation of [0, 1, 90, 180, 271, 360, 450, 719, 720]) {
    for (const analyzer of [0, 37, 90, 180, 270, 360]) {
      const state = spinState(rotation, analyzer);
      const vector = [c(state.a), c(state.b)];
      const theta = analyzer * Math.PI / 180;
      const spinX = expectation(sigma[0], vector)[0];
      const spinZ = expectation(sigma[2], vector)[0];
      close(norm2(vector), 1);
      close(state.plus, (1 + Math.sin(theta) * spinX + Math.cos(theta) * spinZ) / 2);
      close(state.plus + state.minus, 1);
      close(state.spin.x, spinX);
      close(state.spin.z, spinZ);
    }
  }
});

test("interference adds both path amplitudes, with the 2π sign visible only relatively", () => {
  for (const angle of [0, 90, 180, 360, 450, 720]) {
    const state = spinState(angle, 0);
    close(state.bright, norm2([c((1 + state.a) / 2), c(state.b / 2)]));
    const turn = spinState(angle + 360, 37);
    close(turn.a, -state.a);
    close(turn.b, -state.b);
    close(turn.plus, spinState(angle, 37).plus);
    close(turn.bright + state.bright, 1);
  }
  close(spinState(360, 0).bright, 0);
  close(spinState(720, 0).bright, 1);
});

test("Dirac reference states solve the independent four-component Hamiltonian", () => {
  for (const momentum of [-5, -1, -0.05, 0, 0.05, 1, 5]) {
    const state = diracState(momentum, 0);
    const vector = [c(state.a), c(0), c(state.b), c(0)];
    const hamiltonian = beta.map((row, i) => row.map((value, j) => add(value, mul(c(momentum), alpha[2][i][j]))));
    const evolved = apply(hamiltonian, vector);
    evolved.forEach((value, i) => {
      close(value[0], state.energy * vector[i][0]);
      close(value[1], 0);
    });
    close(norm2(vector), 1);
    close(expectation(alpha[2], vector)[0], state.velocity);
    const step = 1e-5;
    const groupVelocity = (Math.hypot(1, momentum + step) - Math.hypot(1, momentum - step)) / (2 * step);
    close(state.velocity, groupVelocity, 1e-9);
    close(state.positiveWeight, 1);
  }
});

test("relative phases preserve density; current and energy projection match matrix observables", () => {
  for (const momentum of [-5, -1, 0, 0.05, 1, 5]) for (const phase of [0, 1, 90, 180, 270, 360]) {
    const state = diracState(momentum, phase);
    const vector = [c(state.a), c(0), c(state.bReal, state.bImaginary), c(0)];
    close(norm2(vector), 1);
    close(state.density, 1);
    close(expectation(alpha[2], vector)[0], state.velocity);
    const energyExpectation = expectation(beta, vector)[0] + momentum * expectation(alpha[2], vector)[0];
    // The spectral projector onto +E is (I + H/E)/2.
    close(state.positiveWeight, (1 + energyExpectation / state.energy) / 2);
    assert.ok(Math.abs(state.velocity) <= 1 + 1e-12);
  }
  close(diracState(1, 90).velocity, 0);
  close(diracState(1, 90).positiveWeight, 3 / 4);
  close(diracState(1, 180).positiveWeight, 1 / 2);
});

test("the free three-dimensional Hamiltonian squares to |p|² + m² and the current obeys the speed bound", () => {
  for (const p of [[0, 0, 0], [1, 2, 3], [-3, 0.2, -0.7]]) {
    const h = beta.map((row, i) => row.map((value, j) => p.reduce((sum, component, k) =>
      add(sum, mul(c(component), alpha[k][i][j])), value)));
    const squared = product(h, h);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      close(squared[i][j][0], i === j ? 1 + p.reduce((sum, v) => sum + v * v, 0) : 0);
      close(squared[i][j][1], 0);
    }
  }
  for (let sample = 0; sample < 100; sample++) {
    const vector = Array.from({ length: 4 }, (_, i) => c(Math.sin(sample + 3 * i + 1), Math.cos(2 * sample + i)));
    const density = norm2(vector);
    const current = alpha.map(matrix => expectation(matrix, vector)[0] / density);
    assert.ok(Math.hypot(...current) <= 1 + 1e-12);
  }
});
