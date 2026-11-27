# Review: Geometrically Formulating Bohmian Theories on Hermitian Vector Bundles

## Manifold and bundle web companions, November 27, 2026

New explanations: [Bohmian motion on a manifold](../docs/bohmian-manifolds.html)
and [When the wave lives in a vector bundle](../docs/bohmian-bundles.html).
The [comparison review](../docs/quantum-manifolds-review.html) places their
formulation advantage alongside standard operator constructions. These are new
web treatments; the TeX baseline and existing article bodies are unchanged.

- Rechecked the public thesis, chapter 3 (printed p. 25 onward, PDF p. 36),
  against Dürr–Goldstein–Taylor–Tumulka–Zanghì,
  [*Quantum Mechanics in Multiply-Connected Spaces*](https://arxiv.org/abs/quant-ph/0506173),
  §§5.2–5.4, and
  [*Topological Factors Derived From Bohmian Mechanics*](https://arxiv.org/abs/quant-ph/0601076),
  §§2–4. The former's §5.2, existence footnote, leaves global existence analysis
  aside; a geometric formula should not be presented as that missing theorem.
- Current conventions: nonpositive connection Laplacian, explicit common mass
  `M`, Hermitian product conjugate-linear first/linear second, compatible
  connection, newest covariant differentiation direction last. In a unitary
  frame `D_i = ∂_i + A_i` with anti-Hermitian `A_i`,
  `Δᴱ = (1/√g) D_i(√g g^{ij} D_j)`. The current is defined by
  `g(j,X) = (ℏ/M) Im h(ψ,∇ᴱ_Xψ)` and `v = j/h(ψ,ψ)` off nodes.
  The local continuity identity follows from compatibility and Hermitian `V`.
- The time-independent frame calculation uses `ψ' = Uψ` and
  `A' = UAU⁻¹ − dU U⁻¹`; transform `V` by conjugation too. A time-dependent
  change needs an extra temporal connection/potential contribution. A generic
  Hermitian bundle is not a spinor bundle. The displayed convective current does
  not establish uniqueness among all currents with the same divergence.
- Independent example: on `S²_R`, normalized
  `ψ = √(3/(8πR²)) sinθ exp(iφ − iℏt/(MR²))` has
  `Δψ = −2ψ/R²`, `θ̇ = 0`, `φ̇ = ℏ/(MR²sin²θ)`.
  The wave is smooth, including its polar zeros; the guiding quotient is not
  defined there. Every nonpolar latitude trajectory is explicit for all time.
  This establishes this example, not a universal theorem.
- Analytic sources actually checked: Braverman–Milatovic–Shubin,
  [math/0201231](https://arxiv.org/abs/math/0201231), Theorem 2.13 and its
  assumptions (a complete boundaryless manifold, smooth compatible connection,
  and smooth Hermitian potential bounded below give a useful safe subcase);
  Teufel–Tumulka, [math-ph/0406030](https://arxiv.org/abs/math-ph/0406030),
  current theorem in §3 and Schrödinger applications in §5. The latter's stated
  configuration-space and integrability hypotheses must not be replaced by
  “all manifolds.” Berndl et al.,
  [quant-ph/9503013](https://arxiv.org/abs/quant-ph/9503013), is a further primary
  global-existence source, not a blanket justification of every new bundle model.
- Comparison sources: Bonneau–Faraut–Valent,
  [quant-ph/0103153](https://arxiv.org/abs/quant-ph/0103153), §§5.2 and 6.2
  (half-line momentum versus Hamiltonian); Gotay,
  [math-ph/9809011](https://arxiv.org/abs/math-ph/9809011) (quantization axioms,
  no-go results, and positive examples); Carosso,
  [1801.02307](https://arxiv.org/abs/1801.02307), §§3–4 (phase-space
  prequantization, integrality, polarization, BKS); da Costa,
  [Phys. Rev. A 23 (1981), 1982–1987](https://doi.org/10.1103/PhysRevA.23.1982),
  read via the linked institutional copy in the web review (confinement-induced
  `−ℏ²(𝓗²−𝓚)/(2M)`). Absence of a self-adjoint canonical momentum does not
  imply absence of suitable Hamiltonians. Bohmian guidance does not select curvature
  potentials or eliminate self-adjoint-domain analysis.
- Publication metadata checked against arXiv records and DOI/publisher records:
  the five-author AHP paper is **7 (2006), 791–807**, DOI
  `10.1007/s00023-006-0269-5`; the five-author J. Phys. A paper is
  **40 (2007), 2997–3031**, DOI `10.1088/1751-8113/40/12/S08`.
  Goldstein–Taylor–Tumulka–Zanghì's *Are All Particles Identical?* is
  **J. Phys. A 38 (2005), 1567–1576**, DOI `10.1088/0305-4470/38/7/012`.
  The same four authors' *Fermionic Wave Functions on Unordered Configurations*,
  [1403.3705](https://arxiv.org/abs/1403.3705), is labeled **2014 preprint**;
  no journal publication is inferred from the arXiv identifier. Its quantum
  triples retain the Hamiltonian domain and position PVM in equivalence claims.
- `tests/holonomy-models.test.mjs` checks sphere normalization and the metric
  Laplacian by independent integration/finite differences, and verifies a
  position-dependent rank-two unitary frame change. These check the examples;
  they do not prove essential self-adjointness or global existence in general.

## Spin and Dirac web companions, November 27, 2026

The [spin explanation](../docs/spin.html) and
[Dirac explanation](../docs/dirac-equation.html) now reconstruct the motivation
in §§3.6 and 3.8 as separate expository paths, each with introductory and
exploratory companions. The original TeX remains unchanged; these pages do not
claim to resolve every issue in the triage below.

- The spin account takes the representation as input and explains the match
  between infinitesimal rotations and curvature. It does not deduce spin one
  half or spin-statistics. In the explicit flat-space model, signed charge `e`
  and SI momentum `π = −iℏ∇ − eA` give
  `[π_i,π_j] = ieℏ ε_ijk B_k`. The antisymmetric part of the Pauli product is
  `(i/2) ε_ijk σ_k [π_i,π_j] = −eℏ σ·B`, fixing the sign and factor in
  `(σ·π)² = π² − eℏ σ·B`. The choice of this square gives `g = 2`;
  representation theory alone does not fix the magnetic coupling.
- The Dirac account explicitly adds the Clifford relation
  `{γ^μ,γ^ν} = 2η^μν I`, with `η = diag(1,−1,−1,−1)` and `x⁰ = ct`.
  Ultralocality, covariance, and current conservation are motivations, not a
  classification theorem. The extra metric selection is already flagged as
  unproved from covariance in the thesis, printed p. 42, footnote 5.
- The standard free equation implies current conservation and componentwise
  Klein–Gordon equations. The explanations state these implications in that
  direction. The current can be null, and curved-space spinors require global
  structure and a compatible connection.
- Source passages checked: the public thesis §§3.6–3.8; Feynman, Leighton,
  and Sands, volume III, chapters 5–6; Tong, *Applications of Quantum Mechanics*,
  §1.5; and Tong, *Quantum Field Theory*, §§4.3, 4.6–4.7. Tong's chiral matrix
  basis is not the standard Dirac basis used in the component experiment;
  bilinear currents and spectra agree after a unitary change of basis.
- `tests/quantum-models.test.mjs` checks Clifford factors/signature, spin
  probabilities against Pauli projectors, path interference, Dirac eigenvector
  residuals, the squared free Hamiltonian, spectral weights, and current bounds.
  These are independent algebraic checks of the examples, not proofs of a
  uniqueness or global-existence claim.

## Original editorial review

Reviewed 2026-07-23. This is an editorial and mathematical triage, not a substitute for specialist peer review.

## Verdict

- **Best category:** substantial expository/web article with some research-level arguments
- **Journal merit as written:** low
- **Journal merit after revision:** moderate only if narrowed to a precise claim not already in the later papers
- **Expository merit:** high
- **Priority:** revise after the topology and spin papers, since they depend on this framework

The draft contains a valuable geometric route from scalar Bohmian mechanics on a Riemannian manifold to Hermitian vector bundles, the Pauli current, and a proposed Dirac construction. Its central bundle framework, however, substantially overlaps the later, more polished treatment in [Quantum Mechanics in Multiply-Connected Spaces](https://arxiv.org/abs/quant-ph/0506173) and [Topological Factors Derived From Bohmian Mechanics](https://arxiv.org/abs/quant-ph/0601076), both coauthored by James Taylor. The draft is still worth preserving because its vector-bundle motivation, intermediate calculations, and Pauli/Dirac route are more expansive.

## Standaloneness

**Assessment: partial.** The paper compiles, but unresolved references (`a:difgeom`, `a:functan`, `c:bohmint`, `c:manpart`, and `c:taylor`) still point into the thesis or other extracted papers. It also begins as a chapter rather than an article: there is no abstract, no statement of audience, and no clear list of results.

The “quick review of tensor analysis” is useful but too compressed for beginners and too long for experts unless it is tightly connected to later formulas. The paper assumes familiarity with Bohmian equivariance just when that idea should be stated cleanly.

## Correctness

The scalar manifold and Hermitian-bundle framework is broadly standard, but a line-by-line mathematical correction is needed.

- Metric compatibility should be stated as \(Dg=0\), with the correctly typed Leibniz identity. The present prose occasionally says that the metric itself vanishes or mixes the base metric and fiber metric.
- The coordinate formulas for the covariant Laplacian need re-derivation. The manuscript moves too freely between scalar, vector, and bundle-valued objects.
- Symmetry of the formal differential expression is not self-adjointness. Domains, completeness/boundary hypotheses, and assumptions on the potential are required.
- The Pauli-current discussion must begin from the standard Pauli current and distinguish a physically motivated current from arbitrary divergence-free additions. Boundary conditions and global topology matter to the “curl addition” argument.
- The claim that an ultralocal velocity law leads to the Dirac equation is presently heuristic, not a classification theorem. “Ultralocal,” covariance, admissible bundle maps, and uniqueness must be defined.
- A Dirac bundle requires appropriate spin or spin-\(c\) structure; it is not available on every manifold. The Clifford relation needs its conventional factor/sign, and the classification of complex irreducible Clifford representations depends on parity.
- The square of the Dirac operator should be stated as a precise Lichnerowicz/Weitzenböck formula with conventions fixed. Lorentz covariance does not follow merely from taking a square root of the metric.

## Understandability

The conceptual arc is strong, but notation obscures it. The expanded legacy macros (`\ensuremath` in particular), idiosyncratic “cc-Hermitian” terminology, and frequent shifts between motivational and theorem-like prose make the argument harder to audit. A reader needs one running model—preferably a spinor on Euclidean configuration space—before the full bundle formalism.

## Related work and novelty

The two later Taylor-coauthored topology papers cited above cover the general bundle/topological setting more authoritatively. Metric connections, bundle Laplacians, Pauli currents, Clifford modules, and the Lichnerowicz formula are established subjects. The potentially new residue is not “Bohmian mechanics on a vector bundle” by itself, but a rigorous uniqueness/classification claim about admissible currents; the draft does not yet prove one.

## Work needed

1. Add an abstract and a one-page roadmap distinguishing established geometry, Bohmian application, and conjectural Dirac material.
2. Resolve all cross-paper references with short local summaries and links to companion drafts.
3. Normalize notation and state dimensions, regularity, domains, and boundary assumptions at each operator definition.
4. Re-derive the continuity equation, Pauli current, and Laplacian in one consistent convention.
5. Either turn the Dirac section into a clearly labeled perspective section or extract and prove a precise classification theorem.
6. Compare every claimed result explicitly with the two later topology papers and with standard Dirac-bundle geometry.

## Publication recommendation

As a single paper, this is too broad and too overlapped by later work for an original-research submission. It could become an excellent self-published exposition titled along the lines of “A Geometric Route to Bohmian Dynamics on Vector Bundles.” A journal submission would need a much narrower result—most plausibly a rigorous classification of admissible local currents or a carefully formulated Pauli/Dirac uniqueness statement—and an explicit account of what is new beyond the published work.
