import test from "node:test";
import assert from "node:assert/strict";
import { population, pointerState, separation, logistic } from "../docs/conversion-model.mjs";

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} differs from ${expected}`);
}

test("resonant transfer, coherent return, detuned bound, and holding intervals", () => {
  for (const [angle, expected] of [[0, 0], [0.5, 0.5], [1, 1], [2, 0]]) {
    close(population(0.8, angle * Math.PI, 0), 0);
    for (const t of [2, 3, 5]) close(population(t, angle * Math.PI, 0), expected);
  }
  for (let i = 0; i <= 100; i++) assert.ok(population(1 + i / 100, Math.PI, 3 * Math.PI) <= 0.1 + 1e-12);
  close(population(1 + 1 / Math.sqrt(10), Math.PI, 3 * Math.PI), 0.1);
});

test("pointer quantiles integrate the current during readout and hold afterwards", () => {
  for (const drive of [0, 0.5 * Math.PI, Math.PI]) for (const u of [0.03, 0.48, 0.5, 0.52, 0.97]) {
    const at = t => pointerState(t, drive, 0, u);
    close(logistic(at(1.4).position), u);
    for (const t of [2.1, 2.9, 3.8]) {
      const state = at(t), d = separation(t);
      close((1-state.b)*logistic(state.position+d) + state.b*logistic(state.position-d), u);
      const step = 1e-5;
      close((at(t + step).position - at(t - step).position)/(2 * step), 4*(2*state.localWeight-1), 1e-6);
    }
    close(at(4).position, at(5).position);
  }
  const read = u => pointerState(5, Math.PI/2, 0, u);
  assert.ok(read(0.48).localWeight < 0.01 && read(0.52).localWeight > 0.99);
  close(read(0.5).position, 0);
});
