# Review: Volume Vectors, Determinants, Trace, and Characteristic Equations

## Web Reviews and exploration, November 27, 2026

The source is Appendix F, “Supplement to Chapter 7,” printed pp. 171–180
([PDF page 182 onward](https://jostylr.com/pdfs/thesis.pdf#page=182)). The web
treatment is now split into two Reviews and one exploratory page:

- [Determinants, trace, and the chain rule](../docs/determinants-trace.html)
  supplies the initial definitions and connects volume geometry, Jacobi's
  formula, composition, and higher derivatives.
- [Jacobians turn motion into density](../docs/jacobians-characteristics.html)
  applies these identities to the variational equation, continuity, a spreading
  Gaussian, and the Hamilton–Jacobi action.
- [Stretch, shear, and carry a density](../docs/jacobian-exploration.html)
  compares exact smooth linear transport with a focusing Newton family. Its
  follow-up tasks use the ideas to audit Euler-step area drift, transport a
  nonuniform density, and distinguish position from phase-space projections.

No new theorem or priority claim is made for the reviewed identities. Accessible
source passages checked include Hanche-Olsen's *The derivative of a determinant*
(two-page PDF), Kahan's *Jacobi's Formula* (pp. 1–2), OpenStax *Calculus Volume 3*
(§§4.5 and 5.7), Grover's survey (especially §2, (2.1), Theorem 2.1, and (2.7)),
Teschl's *Ordinary Differential Equations and Dynamical Systems* (§3.4,
Lemma 3.11), Stanford Math 220A's first-order-equation notes (§§2.1–2.3), and
Tong's *Classical Dynamics* (§4.7). The web articles link each source and explain
its level and use. These sources identify the material as established without
requiring an exhaustive historical priority determination.

The new treatment keeps the following distinctions explicit:

- The top exterior image of `A:V→W` lies in `ΛⁿW`. Vectors are pushed forward
  and forms pulled back; both laws can involve `det A`. Reciprocal factors enter
  when normalizing dual volume elements. For geometric volume scale, coordinate
  determinants are multiplied by `√det g_N / √det g_M`.
- Jacobi's adjugate formula works at singular matrices. The inverse/logarithmic
  versions require invertibility, and `|det A|` can have a cusp at a zero.
- `tr B` is the first derivative of `det(I+hB)` at zero. Zero trace alone does
  not make a finite Euler step preserve volume; `det(exp(tB)) = exp(t tr B)`
  describes the exact constant-generator flow.
- Higher derivatives of the determinant map vanish above its polynomial degree,
  but time derivatives along a nonlinear matrix curve need not vanish.
- The endpoint variation of the action cancels with `Ṗ + ∇V = 0`. A zero
  position Jacobian can signal a caustic while the phase-space family remains
  regular; the scalar determinant alone does not define the Maslov index.

The historical TeX manuscript remains unchanged. The new transport tests compare
the closed matrix formula with a separate exponential series and check the
variational equation, polygon area, half-step composition, mass conservation,
the singular focus, the focusing action, and Gaussian continuity/normalization.
These verify the stated examples; they are not proofs of arbitrary global flow
existence or a general semiclassical continuation.

## Original editorial review

Reviewed 2026-07-23. This is an editorial and mathematical triage, not a substitute for specialist peer review.

## Verdict

- **Best category:** expository web note, preferably split into two notes
- **Journal merit as written:** very low
- **Expository merit after correction:** high
- **Research novelty of trace-from-volume idea:** low
- **Priority:** medium

The exterior-power presentation gives a pleasing common picture: determinant is the action on the top exterior power, trace is its infinitesimal action, and Jacobians control transport equations. That viewpoint is standard rather than new. What may be distinctive is the pedagogical route from these facts to Bohmian characteristic equations and semiclassical caustics.

## Standaloneness

**Assessment: poor.** The opening is literally “Supplement to Chapter …” and depends on the trajectory paper, the set-indexed tensor appendix, and preceding definitions. References to `c:algo` and `c:geom` are unresolved. The final Maslov discussion assumes a semiclassical setup that is never fully established.

The draft should become either:

1. a self-contained linear/differential-geometric note on determinant, trace, and Jacobian evolution; or
2. a methods appendix incorporated into the trajectory paper.

## Correctness

The central definitions are recognizable, but the text has multiple concrete errors.

- If \(A:V\to W\), then \(A^{\otimes n}\nu\in\Lambda^nW\), not \(\Lambda^nV\).
- The sign of a permutation is \((-1)^\sigma\) (or \(\operatorname{sgn}\sigma\)), not \(-1^\sigma\).
- The paper alternates between **volume vectors** in \(\Lambda^nV\) and **volume forms** in \(\Lambda^nV^*\). These transform reciprocally and cannot be interchanged.
- In coordinates, the Riemannian volume form is \(\sqrt{\det(g_{ij})}\,dx^1\wedge\cdots\wedge dx^n\). A metric volume multivector has the reciprocal factor. The displayed \(\sqrt{\det G^{ij}}\) formula is therefore wrong or mislabeled.
- The derivative-of-determinant formulas should be compared with Jacobi’s formula and stated separately for invertible and singular maps. Higher Fréchet derivatives are standard; see Grover’s [Derivatives of Multilinear Functions of Matrices](https://arxiv.org/abs/1007.4402).
- The Hamilton–Jacobi characteristic calculation has a sign error in the integration-by-parts cancellation: with \(\ddot Q=-\nabla V\), the cancelling combination is \(g(\ddot Q,\cdot)+dV\).
- Several displayed equations contain stray symbols and malformed summation indices.
- The Maslov index is not simply the unsigned number of zeros of a Jacobian determinant. Crossing signs, multiplicities, Lagrangian subspaces, and the relation to conjugate points/Morse index must be introduced.

The user’s suggested link between trace and determinant is mathematically important but classical:
\[
\left.\frac{d}{dt}\det(I+tA)\right|_{t=0}=\operatorname{tr}A.
\]
In representation-theoretic terms, trace is the derived action on the determinant line. The manuscript can explain this beautifully, but should not claim novelty without a very specific new application.

## Understandability

The first section is overloaded with custom set notation before the basic geometric idea appears. Ordinary exterior-power notation would make the argument shorter. A two-dimensional worked example would clarify volume vector versus volume form and make the trace identity immediate.

## Related work and novelty

Determinants as top-exterior-power actions, trace as the differential of determinant, Jacobi’s formula, Liouville/Jacobian evolution, and Maslov indices are standard. The linked matrix-derivative survey confirms that even higher determinant derivatives have a substantial literature. The original value available here is synthesis and exposition, especially the path from determinant-line geometry to characteristic transport.

## Work needed

1. Split the linear-algebra exposition from the characteristic/Maslov application.
2. Correct all vector/form transformations and metric determinant factors.
3. Derive Jacobi’s formula cleanly, including singular cases via exterior powers or polynomial differentiation.
4. Rework continuity and Hamilton–Jacobi sections in conventional notation.
5. Either remove the Maslov section or replace it with a careful introductory account supported by standard references.
6. Add a brief “what is standard” note explicitly locating the trace/determinant observation in exterior-power representation theory.

## Publication recommendation

The trace/volume/determinant presentation is a strong expository nugget for the web, not an original journal result by itself. The characteristic-equation material could support the trajectory paper after correction. A standalone journal submission would need a genuinely new theorem or application beyond this classical identity.
