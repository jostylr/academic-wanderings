#!/usr/bin/env python3
"""Check static links and catalogue coverage without fetching external sources."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import parse_qs, unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1] / "docs"
errors = []


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids = set()
        self.links = []
        self.context_links = []
        self.topic_links = []
        self.has_article = False
        self.in_context = False
        self.entries = []
        self.entry = None
        self.options = {}
        self.select = None
        self.h1_count = 0

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            if attrs["id"] in self.ids:
                errors.append(f"{self.path.name}: duplicate ID {attrs['id']}")
            self.ids.add(attrs["id"])
        if tag == "article":
            self.has_article = True
        if tag == "h1":
            self.h1_count += 1
        if tag == "nav" and "page-context" in attrs.get("class", "").split():
            self.in_context = True
        if tag == "li" and "catalogue-entry" in attrs.get("class", "").split():
            self.entry = {key: attrs.get(f"data-{key}", "") for key in ("topic", "category", "tags")}
            self.entries.append(self.entry)
        if tag == "a" and "entry-title" in attrs.get("class", "").split() and self.entry is not None:
            self.entry["href"] = attrs.get("href", "")
        if tag == "a" and "topic-label" in attrs.get("class", "").split():
            self.topic_links.append(attrs.get("href", ""))
        if tag == "select":
            self.select = attrs.get("name")
            self.options[self.select] = set()
        if tag == "option" and self.select:
            self.options[self.select].add(attrs.get("value", ""))
        for key in ("href", "src"):
            if key in attrs:
                self.links.append(attrs[key])
                if self.in_context:
                    self.context_links.append(attrs[key])

    def handle_endtag(self, tag):
        if tag == "nav":
            self.in_context = False
        if tag == "select":
            self.select = None
        if tag == "li":
            self.entry = None


pages = {}
for path in sorted(ROOT.glob("*.html")):
    page = Page(path)
    page.feed(path.read_text())
    pages[path] = page
    if page.h1_count != 1:
        errors.append(f"{path.name}: expected exactly one h1, found {page.h1_count}")

catalogue = pages[ROOT / "browse.html"]
local_count = 0
for path, page in pages.items():
    for href in page.links:
        url = urlsplit(href)
        if url.scheme or url.netloc:
            continue
        local_count += 1
        target = (path.parent / unquote(url.path)).resolve() if url.path else path
        if not target.is_relative_to(ROOT) or not target.is_file():
            errors.append(f"{path.name}: missing/invalid file {href}")
            continue
        if url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f"{path.name}: missing fragment {href}")
        if target.name == "browse.html":
            for field, values in parse_qs(url.query).items():
                if field != "q" and (field not in catalogue.options or any(v not in catalogue.options[field] for v in values)):
                    errors.append(f"{path.name}: unknown catalogue filter {href}")

article_names = {path.name for path, page in pages.items() if page.has_article}
entry_names = Counter(entry.get("href") for entry in catalogue.entries)
for name in article_names:
    if entry_names[name] != 1:
        errors.append(f"{name}: expected one catalogue entry, found {entry_names[name]}")
topic_destinations = {}
for entry in catalogue.entries:
    href = entry.get("href", "")
    for key in ("topic", "category"):
        if not entry[key] or entry[key] not in catalogue.options[key]:
            errors.append(f"{href}: invalid {key} metadata")
    tags = entry["tags"].split()
    if not tags or len(tags) != len(set(tags)) or any(tag not in catalogue.options["tag"] for tag in tags):
        errors.append(f"{href}: missing, repeated, or unknown tags")
    if urlsplit(href).scheme:
        continue
    if href not in article_names:
        errors.append(f"{href}: catalogue points to a non-article")
        continue
    context = pages[ROOT / href].context_links
    expected_links = {f"browse.html?category={entry['category']}", *(f"browse.html?tag={tag}" for tag in tags)}
    if not expected_links.issubset(context):
        errors.append(f"{href}: context category/tags differ from the catalogue")
    topic_links = pages[ROOT / href].topic_links
    if len(topic_links) != 1:
        errors.append(f"{href}: expected exactly one primary topic link")
    elif topic_destinations.setdefault(entry["topic"], topic_links[0]) != topic_links[0]:
        errors.append(f"{href}: primary topic destination differs from its topic companions")

for path in sorted(ROOT.glob("*.mjs")):
    for module in re.findall(r'from\s+[\'"](\.[^\'"]+)[\'"]', path.read_text()):
        if not (path.parent / module).resolve().is_file():
            errors.append(f"{path.name}: missing module import {module}")

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)
print(f"PASS: {len(pages)} HTML pages, {local_count} local links/assets/fragments, "
      f"{len(article_names)} catalogued articles, filter metadata and module imports")
