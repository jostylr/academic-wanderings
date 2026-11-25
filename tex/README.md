# Thesis-derived manuscripts

Each `.tex` file in this directory is self-contained: it has its own
preamble and does not import the thesis's `newcommands.sty` or any of the
thesis source files. Each begins with a bulk extraction of its assigned
thesis material, with the thesis's custom commands expanded, so revision can
proceed here without consulting the old source for omitted prose. The
documents are deliberately working drafts, not publication-ready
transcriptions.

All manuscripts use the shared BibTeX database `references.bib`; references
should be edited there rather than copied into individual `.tex` files.

| File | Intended form | Principal thesis sources |
| --- | --- | --- |
| `01-vector-bundle-bohmian-dynamics.tex` | Web paper / exposition | `geom.tex` |
| `02-topological-quantization-exposition.tex` | Web exposition | `top.tex` |
| `03-virtual-boundaries.tex` | Research paper | `top.tex`, `functan.tex` |
| `04-spin-bundles.tex` | Research paper | `manpart.tex`, `triviality.tex`, `tensor.tex` |
| `05-taylor-expansions.tex` | Mathematics paper | `taylor.tex`, `difgeom.tex` |
| `06-trajectory-iterations.tex` | Research note | `algo.tex` |
| `07-jacobians-and-characteristics.tex` | Expository research note | `app7.tex` |
| `08-set-indexed-tensor-products.tex` | Technical web appendix | `tensor.tex` |
| `09-parallel-frames.tex` | Technical web appendix | `difgeom.tex` |
| `10-velocity-inverse-problem.tex` | Heuristic research note | `ubvel.tex` |
| `11-bohmian-story.tex` | Web exposition | `simint.tex` lines 3--22, `bohmint.tex` from line 6 |

The [public thesis PDF](https://jostylr.com/pdfs/thesis.pdf) is the canonical
reference. A local checkout of the original thesis sources can live in
`thesis/`, which is excluded from Git.

With the original sources in `thesis/`, run `node tools/extract-thesis.mjs`
from the repository root to regenerate the baseline manuscripts. This
overwrites the `.tex` files.

To build every manuscript from the repository root, run:

```sh
latexmk -cd -pdf -interaction=nonstopmode -halt-on-error tex/*.tex
```
