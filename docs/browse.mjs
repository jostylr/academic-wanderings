import { filterAndSort, readFilters, filterQuery } from "./catalogue-model.mjs";

const form = document.getElementById("browse-controls");
const catalogue = document.getElementById("page-catalogue");
const fields = Object.fromEntries(["q", "topic", "category", "tag", "sort"]
  .map(name => [name, form.elements.namedItem(name)]));
const allowed = Object.fromEntries(["topic", "category", "tag", "sort"]
  .map(name => [name, [...fields[name].options].map(option => option.value)]));
const entries = [...catalogue.children].map(element => ({
  element,
  topic: element.dataset.topic,
  category: element.dataset.category,
  tags: element.dataset.tags.split(/\s+/),
  title: element.querySelector(".entry-title").textContent,
  topicLabel: element.querySelector(".entry-meta a:first-child").textContent,
  categoryLabel: element.querySelector(".entry-meta a:last-child").textContent,
  searchText: element.textContent,
}));

function update(historyMode) {
  const filters = Object.fromEntries(Object.entries(fields).map(([name, field]) => [name, field.value]));
  const matching = filterAndSort(entries, filters);
  const visible = new Set(matching);
  entries.forEach(entry => { entry.element.hidden = !visible.has(entry); });
  // The complete static catalogue remains in the DOM, including hidden results.
  catalogue.replaceChildren(...matching.map(entry => entry.element),
    ...entries.filter(entry => !visible.has(entry)).map(entry => entry.element));
  document.getElementById("browse-count").textContent =
    `${matching.length} of ${entries.length} pages${matching.length ? ", sorted by " + fields.sort.selectedOptions[0].textContent.toLowerCase() : ""}.`;
  document.getElementById("browse-empty").hidden = matching.length !== 0;
  if (historyMode) {
    const url = new URL(window.location.href);
    url.search = filterQuery(filters);
    if (url.href !== window.location.href) window.history[historyMode](null, "", url);
  }
}

function restore() {
  const filters = readFilters(window.location.search, allowed);
  for (const [name, value] of Object.entries(filters)) fields[name].value = value;
  update();
}

form.addEventListener("submit", event => {
  event.preventDefault();
  update("pushState");
});
form.addEventListener("change", () => update("pushState"));
fields.q.addEventListener("input", () => update("replaceState"));
form.addEventListener("reset", () => queueMicrotask(() => update("pushState")));
window.addEventListener("popstate", restore);
restore();
form.hidden = false;
