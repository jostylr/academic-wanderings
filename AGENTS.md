# Working on Academic Wanderings

## Purpose and scope

Academic Wanderings is James Taylor's nonlinear blog: essays, worked examples,
interactive experiments, research, reviews, and tentative ideas. It began with
his 2003 Rutgers dissertation, *Connections with Bohmian Mechanics*, but can
follow questions into other subjects. The web is the primary home; a piece can
evolve without becoming a journal article. Distinguish the author's research
from exposition of other people's work, and conjectures from established results.

Read `README.md`, the relevant article, its linked background pages, and any
corresponding `tex/*-review.md` before changing content. Keep work within the
requested scope. An infrastructure or guidance task does not authorize article
revisions; record mathematical concerns for later work instead of silently fixing
them. Preserve unrelated working-tree changes.

## Repository organization

| Location | Role |
| --- | --- |
| `docs/` | Handwritten HTML website; no generator or build step. |
| `docs/index.html` | Navigation grouped into Introductory, Exploratory, My Work, Reviews, and Musings. |
| `docs/style.css` | Shared responsive layout, typography, light/dark colors, math overflow, and experiment styles. |
| `docs/math.js` | KaTeX auto-render initialization within `main`. |
| `docs/*.js` | Page-specific experiments: sphere latitude, ring torus, and Gaussian trajectories. |
| `tex/01-*.tex` through `tex/11-*.tex` | Standalone working manuscripts with their own preambles. |
| `tex/*-review.md` | Editorial and mathematical triage, known defects, literature leads, and revision findings. |
| `tex/references.bib` | Shared bibliography for all manuscripts. |
| `tex/README.md` | Manuscript titles, intended forms, original source mapping, and build commands. |
| `tools/extract-thesis.mjs` | Baseline extraction from an optional original thesis archive. |
| `thesis/` | Optional local source archive, excluded from Git; absent in a fresh checkout. |

The TeX collection covers bundle Bohmian dynamics, topology, virtual boundaries,
spin bundles, Taylor expansions, trajectory iterations, Jacobians and
characteristics, set-indexed tensor products, parallel frames, the velocity
inverse problem, and Bohmian exposition. Use the mapping in `tex/README.md` to
locate original chapters rather than guessing from filenames.

HTML and TeX are independently edited; neither is automatically synchronized.
In particular, `docs/taylor-maps.html` is a revised working paper, while
`tex/05-taylor-expansions.tex` retains the historical baseline. The corresponding
review records both earlier triage and later resolutions. Do not copy an older
formula over a corrected web formula or assume that every review concern is
still unresolved. Check the dated findings and the actual current text.

## Source materials and research

- Canonical dissertation citation: James Taylor, *Connections with Bohmian
  Mechanics*, PhD dissertation, Rutgers University, 2003.
  Public PDF: <https://jostylr.com/pdfs/thesis.pdf>.
- Consult the original PDF or local archive when reconstructing the author's
  argument. Distinguish printed page numbers from PDF page indices; include
  chapter, section, theorem, or equation locators where possible.
- The extraction script reads `thesis/newcommands.sty` and original chapter
  files, expands legacy macros, and **overwrites all eleven `.tex` manuscripts**.
  Do not execute `node tools/extract-thesis.mjs` as a build, test, or routine
  editing step. Use it only for an explicitly requested regeneration, after
  preserving revisions and reviewing the resulting diff.
- Reviews and bibliographies are research leads, not independent verification.
  Follow their links and read the relevant source passages before adopting a
  claim, attribution, or correction. Prefer original papers, authoritative
  monographs, publisher records, and identifiable preprints over search snippets.
- For the bundle/topology material, compare the later Taylor-coauthored papers
  *Quantum Mechanics in Multiply-Connected Spaces*
  (<https://arxiv.org/abs/quant-ph/0506173>) and *Topological Factors Derived
  From Bohmian Mechanics* (<https://arxiv.org/abs/quant-ph/0601076>).
  For covariant Taylor expansions, follow the specific comparisons and locators
  in `docs/taylor-maps.html#references` and its review, including Fulling, Levy,
  Gavrilov, and the horizontal/vertical lift literature.
- Search related terminology as well as the manuscript's own terms (for example,
  jets, normal tensors, covariant Faà di Bruno formulas, and exponential maps).
  Compare hypotheses and conclusions, not just titles. A missing search result
  does not establish novelty; the Taylor paper's publication priority remains
  undetermined.
- Verify authors, titles, dates, versions, identifiers, and cited passages.
  Distinguish preprint dates from publication dates and historical proposals from
  later reconstructions. Never invent citations or quote an unread source.
  If access is unavailable, state exactly what remains unverified.
- Update manuscript references in `tex/references.bib`, reusing existing keys;
  use readable linked references in HTML. When authorized to revise mathematics,
  record substantive corrections, their source locations, reasoning, and checks
  in the corresponding review or revision notes.

## Mathematical conventions

Preserve the conventions of the current revised page and explicitly translate
when comparing sources. The legacy drafts contain inconsistent notation; they
do not establish a uniform convention by themselves.

### Geometry and Taylor expansions

- State the manifolds, regularity, base points, bundles, and chosen connections.
  Use `f^*TN` for the pullback tangent bundle; type-check inputs and outputs.
  Do not assume a metric or a Levi-Civita connection when only an affine
  connection is specified. State torsion-free hypotheses where they are used.
- In the revised Taylor paper, the newest differentiation direction goes
  **last**: `C_1 = df`, `C_{k+1} = ∇C_k`, and
  `C_2(X,Y) = ∇^f_Y(df(X)) - df(∇^M_Y X)`. Keep ordered slots and ordered
  partition blocks until symmetrization is explicitly taken. `Sym` averages over
  permutations; it is not the unnormalized sum.
- Curvature and torsion use
  `R(X,Y)Z = [∇_X,∇_Y]Z - ∇_[X,Y]Z` and
  `T(X,Y) = ∇_X Y - ∇_Y X - [X,Y]`. State the sign when importing a formula.
  With this curvature sign a surface satisfies
  `R(a,b)a = K(⟨a,b⟩a - |a|²b)`.
- Distinguish `T_k = D^k(log_q ∘ f ∘ exp_p)(0)` from the ordered covariant
  derivative `C_k`. For `c(t) = f(exp_p(tv))`, let `a = ċ(0)` and
  `b = D_t ċ(0)`. The revised paper gives
  `C_3(v³) - T_3(v³) = T(a,b)/2`; for a target torsion-free near `q`,
  `C_4(v⁴) - T_4(v⁴) = R(a,b)a`. These are derivative differences;
  polynomial coefficients include `1/k!`. Here `T` denotes torsion while
  subscripted `T_k` denotes the logarithmic jet.
- Exponentials and logarithms are local unless a global domain is justified.
  Smooth finite-order jets and remainder estimates do not imply convergence of
  an infinite Taylor series. Agreement along one curve does not prove flatness
  or a converse about all maps. A total-space bundle connection must be specified.

### Bohmian mechanics and operators

- Keep a possible configuration `q` distinct from the actual configuration
  `Q(t)`. For scalar, nonmagnetic Schrödinger dynamics use
  `ψ = R exp(iS/ℏ)`, `ρ = |ψ|²`,
  `j_k = (ℏ/m_k) Im(ψ̄ ∇_k ψ)`, and `v_k = j_k/ρ` where `ρ > 0`.
  State units and any choice such as `ℏ = m = ω = 1`; do not drop factors when
  switching between dimensionless phase and action `S`.
- State assumptions on potentials, electromagnetic coupling, nodal sets,
  regularity, and flow existence. Equivariance requires appropriate flow and
  boundary hypotheses. A continuity equation alone does not uniquely determine
  a current in higher dimensions.
- For spinors use the conjugate transpose and component contraction, such as
  `ψ†∇ψ`. Distinguish the convective Pauli current from a Dirac-limit current
  with a spin curl term. The same density can support different trajectories.
  Specify which slot of a Hermitian product is complex-linear, and specify
  Clifford signs and factors, before using abstract bundle formulas.
- Separate formal symmetry from self-adjointness: specify the Hilbert space,
  operator domain, boundary conditions, and analytic hypotheses. Bundle
  triviality differs from trivial holonomy. State dimension and topology
  restrictions in identical-particle arguments; do not infer spin-statistics
  from the bundle construction.

## Researching and verifying mathematics

1. Isolate the claim, its quantifiers, hypotheses, conclusion, notation, and
   source location. Label it as established, newly derived, conjectural, or
   heuristic. Resolve the relevant review findings before polishing prose.
2. Re-derive key steps independently. Check tensor arity, bundle fibers,
   derivative order, signs, factorials, units, and contractions. Work out orders
   two through four before trusting a general chain rule. Write enough of the
   derivation for another reader to reproduce it.
3. Test limiting and degenerate cases: flat targets, identity/constant maps,
   geodesics and reparametrizations (including stops), sphere latitudes, and
   changes in curvature on a ring torus. For dynamics use plane waves, stationary
   and moving oscillator Gaussians, released packets, spin examples, and behavior
   near nodes as appropriate. Seek counterexamples to converses and uniqueness.
4. Use symbolic algebra or numerical experiments as independent checks, with
   stated parameters, precision, residuals, and convergence tests. For an
   asymptotic coefficient compare multiple step sizes; account for cancellation
   and roundoff. Check an implementation against an analytic case rather than
   merely comparing two copies of the same formula.
5. Supply a proof for a universal theorem or describe precisely what the
   computation supports. Neither a successful build nor numerical agreement
   proves mathematics. Distinguish a formal fixed-point identity from a
   convergent algorithm. Preserve uncertainty when the evidence is incomplete.

## Website conventions

- Edit HTML directly. Keep relative `.html`, script, stylesheet, and fragment
  links so the site works beneath a hosting subpath. Preserve existing URLs and
  section IDs, and add authorized new pages to the appropriate index category.
- Follow nearby pages: `<!doctype html>`, `lang="en"`, UTF-8, viewport and
  description metadata, a descriptive title ending in `· Academic Wanderings`,
  shared `style.css`, `main.page.page--article`, site/category navigation, and
  semantic article headings and sections. Use `taylor-article` when its shared
  math/table/experiment styles are needed.
- Mathematics uses KaTeX, currently pinned to `0.19.1` on jsDelivr with integrity
  hashes and `crossorigin="anonymous"`. Preserve deferred load order: KaTeX,
  auto-render, `math.js`, then any page experiment. Use `\(...\)` inline and
  `\[...\]` for displays; HTML-escape `<`, `>`, and `&` inside math as needed.
  Keep wide equations horizontally scrollable using existing styles.
- Reuse CSS variables and shared responsive and dark-mode styles. Keep inputs
  labeled, tables intelligible, canvas experiments accompanied by explanatory
  text or values, and the article readable without an experiment running.
  Existing experiments start hidden and are revealed by JavaScript.
- RatMath is an optional direction for interactive examples, linked at
  <https://calc.ratmath.com/>; the current experiments are plain browser
  JavaScript, with no installed RatMath dependency. Do not introduce a framework,
  package manager, or bundler for routine article work.

## Commands and validation

Run commands from the repository root. There is currently no checked-in test
suite, package manifest, or CI workflow. Choose checks appropriate to the change
and report their actual results, including pre-existing warnings.

```sh
# Static preview; open http://localhost:8000/
python3 -m http.server --bind 127.0.0.1 --directory docs 8000

# Syntax only: checks the extractor without running its destructive generation
node --check tools/extract-thesis.mjs
for file in docs/*.js; do node --check "$file" || exit; done

# TeX build (requires latexmk, a TeX distribution, BibTeX, and scalable T1 fonts)
latexmk -cd -pdf -interaction=nonstopmode -halt-on-error tex/*.tex

# Whitespace and scope review
git diff --check
git status --short
git diff --stat
```

For a single manuscript, replace `tex/*.tex` with its filename. Build products
are ignored by `tex/.gitignore`; a copy of `tex/` in a temporary directory can
also be compiled to keep the checkout untouched. Inspect logs for unresolved
citations/references and layout warnings even when compilation succeeds. Legacy
cross-chapter references can remain unresolved; do not conceal them or repair
articles outside the task scope.

The manuscripts use T1 font encoding and `microtype`. If pdfTeX reports
`auto expansion is only possible with scalable fonts`, check that scalable T1
fonts (for example, CM-Super) are installed and available to TeX. Report the
environment failure rather than changing article preambles just to pass a check.

For website changes, check local file and fragment targets, serve the site, and
inspect rendered equations and the browser console. Exercise affected controls
at representative and endpoint values, test a narrow viewport and both color
schemes, and check that the prose remains usable without JavaScript. KaTeX and
the optional web font need network access; report unavailable checks honestly.

For documentation-only work, verify referenced paths and commands and review
the diff; do not add artificial tests. Before committing, confirm that only
intended files changed and no thesis archive or build products are staged.
When a commit or pull request is requested, use a focused branch, stage explicit
paths, describe the resulting guidance and validation, push that branch, and
open a pull request against the repository's verified default branch. Creating
a pull request does not authorize merging or publishing the site.
