# Review: A Very Useful Frame Field

Reviewed 2026-07-23. This is an editorial and mathematical triage, not a substitute for specialist peer review.

## Verdict

- **Best category:** short expository lemma/note
- **Journal merit:** none by itself
- **Web/expository merit:** good after a rigorous rewrite
- **Priority:** medium, as supporting material for paper 05

The note constructs a local frame by parallel-transporting a basis radially along geodesics from a base point. In that radial gauge, the fully symmetrized covariant derivatives of the frame vanish at the center. This is a useful computational device, but it is standard normal-coordinate/radial-gauge geometry rather than a new result.

## Standaloneness

**Assessment: weak.** Although short, the note relies on unresolved references to the geometry, Taylor, and map-expansion chapters (`c:geom`, `c:taylor`, `tc:da`, `tc:imp`). It needs definitions of the induced connection on \(\operatorname{End}(E)\), the symmetrization convention, and the curvature sign convention.

The title is friendly but not searchable. “Radially Parallel Frames and Symmetrized Covariant Derivatives” would identify the content.

## Correctness

The basic radial-frame construction is sound in a normal neighborhood. The details need repair.

- The construction requires a star-shaped normal neighborhood avoiding the cut locus; it is not a frame on an arbitrary neighborhood.
- \(D^2\psi\) is a two-covariant tensor with values in \(E\), while curvature is the antisymmetrized commutator
  \[
  R^E(X,Y)\psi=D_XD_Y\psi-D_YD_X\psi-D_{[X,Y]}\psi.
  \]
  Thus the manuscript’s equation \(D^2\psi=R\psi\) is false as written. A factor and sign depend on the chosen antisymmetrization convention.
- The claim that symmetrized derivatives vanish should be stated precisely: radial parallelism gives identities after full contraction with repeated radial vectors, and polarization then yields the fully symmetric part at the center under suitable smoothness assumptions.
- Curvature of the bundle connection is independent of which auxiliary affine connection is used to package \(D^2\), but it certainly depends on the bundle connection. The current wording “independent of the connection on the manifold” is easy to misread.
- For a metric/Hermitian connection, curvature endomorphisms are skew-adjoint. That standard result should be proved by differentiating metric compatibility and using the curvature commutator, not by the incorrect \(D^2=R\) identity.

The relation between exponential-map derivatives and curvature is part of a developed literature; Gavrilov’s [Taylor series related to the differential of the exponential map](https://arxiv.org/abs/1205.2868) is a useful comparison for the surrounding Taylor project. Radial gauge is also a standard gauge-theory construction.

## Understandability

The geometric picture is intuitive but never drawn in words: choose a basis at \(p\), follow each radial geodesic, and parallel-transport that basis. Stating that in one paragraph before the notation would greatly help. The proof should distinguish the first-order radial-gauge fact from the curvature consequences at second and higher order.

## Related work and novelty

Radial gauge, normal frames, and curvature-controlled Taylor coefficients are standard in differential geometry and gauge theory. Gavrilov’s paper is relevant to the surrounding exponential-map calculation, but a textbook-level search should also be done before selecting citations. No new theorem is presently visible; the value is a compact lemma tailored to paper 05.

## Work needed

1. State a precise theorem on a normal neighborhood and prove the symmetric-derivative vanishing by polarization.
2. Replace every occurrence of \(D^2=R\) with the correct antisymmetrized commutator formula.
3. Fix curvature and symmetrization conventions once.
4. Add a proposition proving skew-adjointness for metric/Hermitian connections.
5. Resolve all cross-references with a compact local setup.
6. Decide whether this is a standalone note or an appendix to paper 05; avoid maintaining duplicate versions.

## Publication recommendation

Publish on the web as a polished supporting note or incorporate it into the Taylor-expansions paper. It is useful exposition, but there is no evident original result sufficient for journal publication.
