import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("actual page IDs and control handlers update the diagram, opposite jiggle, balance, and reset", async () => {
  // A minimal DOM adapter checks wiring, not browser rendering or layout.
  const html = readFileSync(new URL("../docs/species-exploration.html", import.meta.url), "utf8");
  const nodes = new Map();
  for (const match of html.matchAll(/<[a-z][^>]*\bid="([^"]+)"[^>]*>/g)) {
    const markup = match[0], attributes = {}, listeners = {};
    const defaultValue = markup.match(/\bvalue="([^"]*)"/)?.[1] ?? "";
    const node = {
      value: defaultValue, defaultValue,
      get valueAsNumber() { return Number(this.value); },
      checked: /\bchecked\b/.test(markup), defaultChecked: /\bchecked\b/.test(markup),
      hidden: /\bhidden\b/.test(markup), style: {},
      setAttribute(name, value) { attributes[name] = String(value); },
      getAttribute(name) { return attributes[name]; },
      addEventListener(name, handler) { listeners[name] = handler; },
      fire(name) { assert.ok(listeners[name], `missing ${match[1]} ${name} handler`); listeners[name](); },
      querySelector(selector) { assert.match(selector, /^#[\w-]+$/); return nodes.get(selector.slice(1)); },
    };
    nodes.set(match[1], node);
  }
  const get = suffix => {
    const node = nodes.get(`species-${suffix}`);
    assert.ok(node, `missing species-${suffix}`);
    return node;
  };
  const previousDocument = globalThis.document;
  try {
    globalThis.document = { getElementById: id => nodes.get(id) };
    await import("../docs/species-exploration.mjs");
    assert.equal(get("lab").hidden, false);
    assert.match(get("outcome").textContent, /^A-like/);
    assert.match(get("counterfactual").textContent, /^B-like/);
    assert.ok(Number(get("tail").textContent) > 0);
    get("negative").fire("click");
    assert.match(get("outcome").textContent, /^B-like/);
    get("balanced").fire("click");
    assert.equal(get("balanced-note").hidden, false);
    assert.match(get("outcome").textContent, /^No dominant/);
    for (const displacement of [-0.12, 0, 0.12]) for (const time of [0, 1.5, 3]) {
      get("jiggle").value = displacement;
      get("time").value = time;
      get("jiggle").fire("input");
      get("time").fire("input");
      assert.ok(Number.isFinite(Number(get("point-0").getAttribute("cx"))));
      assert.ok(Number.isFinite(Number(get("point-1").getAttribute("y"))));
      assert.doesNotMatch(get("path-0").getAttribute("d"), /NaN|Infinity/);
      assert.doesNotMatch(get("desc").textContent, /undefined|NaN/);
    }
    get("compare").checked = false;
    get("compare").fire("change");
    assert.equal(get("shadow-0").style.display, "none");
    get("reset").fire("click");
    assert.equal(Number(get("jiggle").value), 0.04);
    assert.equal(Number(get("time").value), 3);
    assert.equal(get("compare").checked, true);
    assert.equal(get("balanced-note").hidden, true);
    assert.match(get("outcome").textContent, /^A-like/);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
