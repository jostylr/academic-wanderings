# Academic Wanderings

Academic Wanderings is James Taylor’s nonlinear blog for exploring ideas through essays,
worked examples, and notes. It began with material from his 2003 Rutgers
dissertation and revises and expands that material alongside new subjects.
Some pages develop the author’s own ideas. Others explain or build on other
people’s work and cite the sources they draw on. The web is the primary home
for these explorations, and pieces can evolve as the ideas develop.

For canonical references to the dissertation, cite James Taylor,
*Connections with Bohmian Mechanics*, PhD dissertation, Rutgers University,
2003. [Public thesis PDF](https://jostylr.com/pdfs/thesis.pdf)

## Kinds of pages

Start with a [topic path](docs/index.html#topics), or use the
[full catalogue](docs/browse.html) to search, filter by topic, category, and tag,
and sort by title, topic, or category. Each page has one main topic and one
category; related tags connect ideas across topics. Filters are saved in the
URL, so a selection can be bookmarked or shared. Without JavaScript the
catalogue still lists every page.

- [Introductory](docs/index.html#introductory) pages explain basic ideas that
  later pieces can link back to.
- [Explanation](docs/index.html#explanation) pages follow the main motivation
  and argument, stating the choices on which they depend.
- [Exploratory](docs/index.html#exploratory) pages try things out through
  examples, computations, and interactive experiments, including RatMath.
- [My Work](docs/index.html#my-work) covers the author’s own research, papers,
  and projects.
- [Reviews](docs/index.html#reviews) give sourced accounts of established ideas
  and discuss other people’s work, with questions and directions to follow up.
- [Musings](docs/index.html#musings) collect tentative ideas and half-formed
  thoughts.

Spin and the Dirac equation each have a separate introduction, primary
explanation, and interactive exploration. The explanations reconstruct motivating
ideas from the thesis alongside standard sources; they are not uniqueness proofs
or new historical priority claims.

The [determinants and transport path](docs/determinants-trace.html) reviews the
classical material in Appendix F: determinant and trace identities, chain rules,
Jacobians, continuity, and action along characteristics. Two sourced Reviews
lead into an interactive exploration and onward to the Gaussian and higher-chain-rule
examples. Their starting definitions are included in the reviews themselves.

## Project layout

- [Web pages](docs/index.html) are written directly in HTML and use KaTeX for
  mathematics. Individual pages can add RatMath JavaScript modules for
  interactive examples.
- [TeX drafts](tex/) contains the standalone manuscripts, editorial reviews,
  and shared BibTeX database.
- A local reference archive, when present, lives in `thesis/`. The directory
  is excluded from Git, including its copy of `thesis.pdf`.

## Local preview

From the repository root, run:

```sh
python3 -m http.server --bind 127.0.0.1 --directory docs 8000
```

Open [localhost:8000](http://localhost:8000). Pages load KaTeX from jsDelivr.
Use `\(...\)` for inline math and `\[...\]` for display math. See
[the first article](docs/bohmian-mechanics.html) for the HTML structure.

## Adding and checking pages

Keep HTML handwritten. Add one `catalogue-entry` to `docs/browse.html` for each
article, including `data-topic`, `data-category`, and space-separated `data-tags`
tokens. Reuse the filter options' tokens; add a readable option when introducing
a new one. Match the article's compact topic/category/tag links to that entry.
The catalogue script reads this static markup, so no generated manifest or build
is required. Add a homepage path only when it helps a reader enter a topic;
the catalogue is the complete listing. Keep existing URLs and fragment IDs.

Run the dependency-free checks from the repository root:

```sh
python3 tools/check-site.py
node --test tests/*.test.mjs
for file in docs/*.js docs/*.mjs; do node --check "$file" || exit; done
git diff --check
```

The site check covers local links, fragments, module imports, catalogue coverage,
and filter metadata. The Node tests check catalogue filtering/sorting and compare
the quantum and transport experiments against independent calculations, including
matrix exponentials, polygon area, and continuity/action residuals. For changed
pages, also inspect KaTeX rendering, filters, history navigation, controls,
small-screen layout, both color schemes, and the no-JavaScript reading path in a
browser when preview is available.
