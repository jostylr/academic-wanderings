const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });
export const normalize = value => value.normalize("NFKD")
  .replace(/\p{Diacritic}/gu, "").replaceAll("-", " ").toLowerCase();

export function filterAndSort(entries, filters) {
  const words = normalize(filters.q || "").trim().split(/\s+/).filter(Boolean);
  const matching = entries.filter(entry =>
    (!filters.topic || entry.topic === filters.topic) &&
    (!filters.category || entry.category === filters.category) &&
    (!filters.tag || entry.tags.includes(filters.tag)) &&
    words.every(word => normalize(entry.searchText).includes(word)));
  const sort = filters.sort || "topic";
  return matching.sort((a, b) => {
    const group = sort === "topic" ? collator.compare(a.topicLabel, b.topicLabel)
      : sort === "category" ? collator.compare(a.categoryLabel, b.categoryLabel) : 0;
    return group || collator.compare(a.title, b.title);
  });
}

export function readFilters(search, allowed) {
  const params = new URLSearchParams(search);
  const result = { q: (params.get("q") || "").trim(), sort: "topic" };
  for (const field of ["topic", "category", "tag", "sort"]) {
    const value = params.get(field) || "";
    result[field] = allowed[field].includes(value) ? value : field === "sort" ? "topic" : "";
  }
  return result;
}

export function filterQuery(filters) {
  const params = new URLSearchParams();
  for (const field of ["q", "topic", "category", "tag", "sort"]) {
    const value = (filters[field] || "").trim();
    if (value && !(field === "sort" && value === "topic")) params.set(field, value);
  }
  return params.toString();
}
