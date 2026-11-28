import assert from "node:assert/strict";
import test from "node:test";
import { visibleFlux } from "../docs/collision-model.mjs";

test("a closed exit, disconnected mixer, or radial node carries no converted flux", () => {
  assert.equal(visibleFlux(0.5, 0, 1), 0);
  assert.equal(visibleFlux(1, 2, 1), 0);
  assert.equal(visibleFlux(2, 2, 0), 0);
  assert.ok(visibleFlux(Math.PI ** 2, 0.5, 1) < 1e-28);
});

test("visible flux agrees with independent four-amplitude boundary matching", () => {
  assert.ok(Math.abs(visibleFlux(2, 0, 1) - 0.8788472601549183) < 1e-12);
  assert.ok(Math.abs(visibleFlux(6, 2, 1) - 0.4621880221409825) < 1e-12);
});

test("newly opened s-wave flux scales with the outgoing speed", () => {
  const first = visibleFlux(1 + 1e-8, 2, 1);
  const second = visibleFlux(1 + 4e-8, 2, 1);
  assert.ok(Math.abs(second / first - 2) < 1e-4);
});
