import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterAndSort, readFilters, filterQuery } from "../docs/catalogue-model.mjs";

// Exercise the actual static catalogue rather than a separately maintained fixture.
const html = readFileSync(new URL("../docs/browse.html", import.meta.url), "utf8");
const plain = value => value.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const entries = [...html.matchAll(/<li class="catalogue-entry" data-topic="([^"]+)" data-category="([^"]+)" data-tags="([^"]+)">([\s\S]*?)<\/li>/g)]
  .map(([, topic, category, tags, body]) => {
    const meta = body.match(/<p class="entry-meta">([\s\S]*?)<\/p>/)[1];
    const metaLinks = [...meta.matchAll(/<a [^>]*>([^<]+)<\/a>/g)].map(match => match[1]);
    return { topic, category, tags: tags.split(" "), title: plain(body.match(/class="entry-title"[^>]*>([^<]+)</)[1]),
      topicLabel: metaLinks[0], categoryLabel: metaLinks[1], searchText: plain(body) };
  });

test("catalogue has a separate introduction, explanation, and exploration for each new topic", () => {
  assert.ok(entries.length > 0);
  for (const topic of ["spin", "dirac"]) {
    const categories = entries.filter(entry => entry.topic === topic).map(entry => entry.category);
    for (const category of ["explanation", "exploratory", "introductory"]) assert.ok(categories.includes(category));
  }
});

test("determinants and transport has sourced Reviews and an exploration, without requiring a new introduction", () => {
  const reviews = filterAndSort(entries, { topic: "volume-transport", category: "reviews" });
  for (const title of ["Determinants, trace, and the chain rule", "Jacobians turn motion into density"]) {
    assert.ok(reviews.some(entry => entry.title === title));
  }
  const exploration = filterAndSort(entries, { topic: "volume-transport", category: "exploratory", tag: "transport" });
  assert.ok(exploration.some(entry => entry.title === "Stretch, shear, and carry a density"));
  assert.ok(filterAndSort(entries, { tag: "probability-current" }).some(entry => entry.topic === "volume-transport"));
});

test("quantum geometry connects three explanations, a review, and a holonomy exploration", () => {
  const geometry = filterAndSort(entries, { topic: "quantum-geometry" });
  for (const title of ["Bohmian motion on a manifold", "When the wave lives in a vector bundle",
    "How topological factors enter a quantum theory"]) {
    assert.ok(geometry.some(entry => entry.title === title && entry.category === "explanation"));
  }
  assert.ok(filterAndSort(geometry, { category: "reviews", tag: "operator-domains" }).length > 0);
  assert.ok(filterAndSort(geometry, { category: "exploratory", tag: "holonomy" }).length > 0);
  assert.ok(filterAndSort(entries, { tag: "manifolds" }).some(entry => entry.topic !== "quantum-geometry"));
});

test("particle identity links its bundle explanation to an exploration through species tags", () => {
  const topic = filterAndSort(entries, { topic: "particle-identity", tag: "species" });
  for (const title of ["Particles without permanent species labels", "Species, bundles, and exchange characters"]) {
    assert.ok(topic.some(entry => entry.title === title && entry.category === "explanation"));
  }
  assert.ok(filterAndSort(topic, { category: "exploratory", tag: "wave-packets" })
    .some(entry => entry.title === "Jiggle a configuration, change its outgoing role"));
  assert.ok(filterAndSort(entries, { tag: "vector-bundles" }).some(entry => entry.topic === "quantum-geometry"));
});

test("topic, category, tag, and all search terms combine as intersections", () => {
  const result = filterAndSort(entries, { topic: "dirac", category: "exploratory", tag: "spinors", q: "PHASE current" });
  assert.ok(result.some(entry => entry.title === "Read a velocity from a Dirac spinor"));
  assert.ok(result.every(entry => entry.topic === "dirac" && entry.category === "exploratory" && entry.tags.includes("spinors")));
  const current = filterAndSort(entries, { tag: "probability-current" });
  assert.ok(current.some(entry => entry.topic === "bohmian-mechanics"));
  assert.ok(current.some(entry => entry.topic === "dirac"));
  assert.equal(filterAndSort(entries, { q: "not-in-this-catalogue" }).length, 0);
});

test("sort modes order labels and titles without changing the original catalogue", () => {
  const original = [...entries];
  const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });
  for (const sort of ["title", "topic", "category"]) {
    const result = filterAndSort(entries, { sort });
    for (let i = 1; i < result.length; i++) {
      const a = result[i - 1], b = result[i];
      const group = sort === "title" ? 0 : collator.compare(a[`${sort}Label`], b[`${sort}Label`]);
      assert.ok((group || collator.compare(a.title, b.title)) <= 0);
    }
  }
  assert.deepEqual(entries, original);
});

test("filter URLs round-trip and invalid select values have safe defaults", () => {
  const allowed = {
    topic: ["", ...new Set(entries.map(entry => entry.topic))],
    category: ["", "reviews", "musings", ...new Set(entries.map(entry => entry.category))],
    tag: ["", ...new Set(entries.flatMap(entry => entry.tags))],
    sort: ["topic", "title", "category"],
  };
  const filters = { q: "phase & current", topic: "dirac", category: "exploratory", tag: "spinors", sort: "title" };
  assert.deepEqual(readFilters(filterQuery(filters), allowed), filters);
  assert.deepEqual(readFilters("topic=unknown&category=unknown&tag=unknown&sort=unknown", allowed),
    { q: "", topic: "", category: "", tag: "", sort: "topic" });
  assert.equal(filterQuery({ q: "  ", topic: "", sort: "topic" }), "");
});
