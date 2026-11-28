import test from "node:test";
import assert from "node:assert/strict";
import { packetAt, speciesPackets, identityState, traceIdentity } from "../docs/identity-models.mjs";

const add = (a, b) => a.map((x, i) => x + b[i]);
const scale = (a, s) => a.map(x => x * s);
const sub = (a, b) => add(a, scale(b, -1));
const norm2 = ([x, y]) => x * x + y * y;
const imaginaryInner = ([x, y], [u, v]) => x * v - y * u;
function near(a, b, tolerance = 1e-9) {
  assert.ok(Math.abs(a - b) <= tolerance, `${a} ≠ ${b} (tolerance ${tolerance})`);
}
function vectorNear(a, b, tolerance) { a.forEach((x, i) => near(x, b[i], tolerance)); }
const derivative = (f, t, h = 1e-5) => scale(sub(f(t + h), f(t - h)), 1 / (2 * h));

test("the complex two-dimensional packets solve the free PDE and have the stated phase-gradient currents", () => {
  for (const packet of speciesPackets()) for (const time of [0, 0.2, 1.1, 3]) {
    const point = [0.6, -0.3], wave = packetAt(point, time, packet).wave;
    const timeD = derivative(t => packetAt(point, t, packet).wave, time);
    let laplacian = [0, 0];
    for (const i of [0, 1]) {
      const axisWave = delta => packetAt(point.map((x, j) => x + (i === j ? delta : 0)), time, packet).wave;
      const h = 1e-4;
      laplacian = add(laplacian, scale(sub(add(axisWave(h), axisWave(-h)), scale(wave, 2)), 1 / h ** 2));
      const grad = derivative(axisWave, 0);
      near(imaginaryInner(wave, grad) / (packet.mass * norm2(wave)),
        packetAt(point, time, packet).velocity[i], 2e-8);
    }
    vectorNear([-timeD[1], timeD[0]], scale(laplacian, -1 / (2 * packet.mass)), 3e-6);
    near(Math.exp(packetAt(point, time, packet).logDensity), norm2(wave));
  }
});

test("radial integration independently normalizes both spreading packets", () => {
  for (const packet of speciesPackets()) for (const time of [0, 0.7, 3]) {
    const deviation = Math.sqrt(packetAt([0, 0], time, packet).variance);
    const count = 2000, step = 9 * deviation / count;
    let integral = 0;
    for (let k = 0; k <= count; k++) {
      const r = k * step, point = [packet.velocity[0] * time + r, 0];
      const factor = k === 0 || k === count ? 1 : k % 2 ? 4 : 2;
      integral += factor * norm2(packetAt(point, time, packet).wave) * 2 * Math.PI * r;
    }
    near(integral * step / 3, 1, 2e-10);
  }
});

test("the identity current agrees with independent complex wave derivatives and permutes with the points", () => {
  const packets = speciesPackets();
  for (const time of [0, 0.3, 1, 3]) for (const points of [
    [[0.04, -0.45], [0, 0.45]], [[2, 0.3], [-1.8, 0.2]], [[-0.3, 0.7], [0.2, -0.2]],
  ]) {
    const state = identityState(points, time);
    const swapped = identityState([...points].reverse(), time);
    near(state.weight, swapped.reverseWeight);
    near(state.logDensity, swapped.logDensity);
    const density = points.map(p => packets.map(s => norm2(packetAt(p, time, s).wave)));
    const denominator = density[0][0] * density[1][1] + density[0][1] * density[1][0];
    for (const j of [0, 1]) {
      vectorNear(state.velocities[j], swapped.velocities[1 - j]);
      for (const axis of [0, 1]) {
        let current = 0;
        for (const s of [0, 1]) {
          const wave = packetAt(points[j], time, packets[s]).wave;
          const grad = derivative(delta => packetAt(points[j].map((x, i) => x + (i === axis ? delta : 0)), time, packets[s]).wave, 0);
          current += imaginaryInner(wave, grad) / packets[s].mass * density[1 - j][1 - s];
        }
        near(state.velocities[j][axis], current / denominator, 2e-8);
      }
    }
  }
});

test("the normalized ordered density and summed four-dimensional current satisfy continuity", () => {
  const density = (q, t) => Math.exp(identityState(q, t).logDensity) / 2;
  const h = 2e-5;
  for (const time of [0, 0.2, 1.2, 3]) {
    const points = [[0.3, -0.45], [-0.2, 0.45]];
    const timeD = (density(points, time + h) - density(points, time - h)) / (2 * h);
    let divergence = 0;
    for (const j of [0, 1]) for (const axis of [0, 1]) {
      const current = delta => {
        const q = points.map((p, k) => p.map((x, i) => x + (k === j && i === axis ? delta : 0)));
        return density(q, time) * identityState(q, time).velocities[j][axis];
      };
      divergence += (current(h) - current(-h)) / (2 * h);
    }
    near(timeD + divergence, 0, 2e-9);
  }
});

test("branch dominance has the stated velocity error and remains finite in very distant tails", () => {
  for (const points of [[[6, -1], [-6, 1]], [[-6, -1], [6, 1]], [[1000, 30], [-900, -40]]]) {
    const state = identityState(points, 3);
    assert.ok(Number.isFinite(state.logDensity));
    near(state.weight + state.reverseWeight, 1);
    for (const j of [0, 1]) {
      assert.ok(state.velocities[j].every(Number.isFinite));
      const [a, b] = [state.branchVelocities[0][j], state.branchVelocities[1][j]];
      vectorNear(sub(state.velocities[j], a), scale(sub(b, a), state.reverseWeight));
    }
  }
  const final = traceIdentity().at(-1);
  assert.ok(final.reverseWeight > 0 && final.reverseWeight < 1e-20);
});

test("nearby initial configurations reach opposite roles and converge under step halving", () => {
  for (const displacement of [-0.12, -0.04, -0.002, 0, 0.002, 0.04, 0.12]) {
    const coarse = traceIdentity({ displacement });
    const fine = traceIdentity({ displacement, step: 0.0025 });
    const finer = traceIdentity({ displacement, step: 0.00125 }).at(-1);
    const end = coarse.at(-1);
    for (const j of [0, 1]) {
      vectorNear(end.points[j], fine.at(-1).points[j], 2e-6);
      vectorNear(fine.at(-1).points[j], finer.points[j], 1.5e-7);
    }
    assert.ok(coarse.every(frame => Math.hypot(...sub(frame.points[0], frame.points[1])) >= 0.89));
    if (displacement > 0) assert.ok(end.reverseWeight < 1e-18);
    if (displacement < 0) assert.ok(end.weight < 1e-18);
    if (displacement === 0) coarse.forEach(frame => near(frame.weight, 0.5));
  }
});

test("an equal-mass balanced trajectory agrees with an independent exact spreading solution", () => {
  for (const frame of traceIdentity({ displacement: 0, massRatio: 1 })) {
    const spreading = Math.sqrt(1 + (frame.time / (2 * 0.7 ** 2)) ** 2);
    vectorNear(frame.points[0], [0, -0.45 * spreading], 2e-10);
    vectorNear(frame.points[1], [0, 0.45 * spreading], 2e-10);
  }
});

test("three assignment sign lines obey permutation composition for two fermionic A points and one B", () => {
  const permutations = [[0, 1, 2], [1, 0, 2], [0, 2, 1], [2, 1, 0], [1, 2, 0], [2, 0, 1]];
  // Basis component b specifies B's location; the remaining sorted pair orients A's line.
  const transport = (permutation, b) => {
    const a = [0, 1, 2].filter(x => x !== b).map(x => permutation[x]);
    return { component: permutation[b], sign: a[0] < a[1] ? 1 : -1 };
  };
  for (const p of permutations) for (const q of permutations) for (const b of [0, 1, 2]) {
    const first = transport(q, b), second = transport(p, first.component);
    const combined = transport(q.map(x => p[x]), b);
    assert.deepEqual(combined, { component: second.component, sign: first.sign * second.sign });
  }
  assert.deepEqual(transport([1, 0, 2], 2), { component: 2, sign: -1 });
  assert.equal(transport([0, 2, 1], 2).component, 1);
  // Enumerate the tensor direct-sum dimension without an extra multinomial per assignment.
  const dimensions = [2, 3];
  let rank = 0, fixedPopulationRank = 0;
  for (let bits = 0; bits < 8; bits++) {
    const assignment = [0, 1, 2].map(i => (bits >> i) & 1);
    const dimension = assignment.reduce((n, s) => n * dimensions[s], 1);
    rank += dimension;
    if (assignment.filter(s => s === 1).length === 1) fixedPopulationRank += dimension;
  }
  assert.equal(rank, (2 + 3) ** 3);
  assert.equal(fixedPopulationRank, 3 * 2 ** 2 * 3);
});
