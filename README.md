# Academic Wanderings

Academic Wanderings is James Taylor’s nonlinear blog for exploring ideas through essays,
worked examples, and notes. It began with material from his 2003 Rutgers
dissertation and revises and expands that material alongside new subjects.
Some pages develop the author’s own ideas. Others explain or build on other
people’s work and cite the sources they draw on. The web is the primary home
for these explorations, and pieces can evolve as the ideas develop.

For canonical references to the dissertation, cite James Oliver Taylor,
*Connections with Bohmian Mechanics*, PhD dissertation, Rutgers University,
2003. [Public thesis PDF](https://jostylr.com/pdfs/thesis.pdf)

## Kinds of pages

- [Introductory](docs/index.html#introductory) pages explain basic ideas that
  later pieces can link back to.
- [Exploratory](docs/index.html#exploratory) pages try things out through
  examples, computations, and interactive experiments, including RatMath.
- [My Work](docs/index.html#my-work) covers the author’s own research, papers,
  and projects.
- [Reviews](docs/index.html#reviews) discuss other people’s work, including
  summaries, questions, and directions worth following up.
- [Musings](docs/index.html#musings) collect tentative ideas and half-formed
  thoughts.

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
