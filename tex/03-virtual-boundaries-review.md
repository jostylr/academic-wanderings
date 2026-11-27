# Review: Virtual Boundaries and Cut-Independent Quantum Hamiltonians

## Circle web example and unresolved general claim, November 27, 2026

The new [topological-factors page](../docs/topological-factors.html#cut) uses
only the explicit free circle construction: in `L²((0,2π),R dθ)`, the domain is
`{u∈H²: u(2π)=γu(0), u′(2π)=γu′(0)}`, `|γ|=1`. The twisted Fourier basis
diagonalizes the operator with real eigenvalues and fixes its self-adjoint
realization. It is stronger evidence than boundary-form cancellation alone.
The [circle exploration](../docs/holonomy-exploration.html) moves the seam for
one exact mode and compares cover and connection descriptions of that same
state. It is not a proof of the general cut-independence claim.

Bonneau–Faraut–Valent, [quant-ph/0103153](https://arxiv.org/abs/quant-ph/0103153),
§§5–6, was checked for the momentum/Hamiltonian distinction and interval
extension families. A general interval `U(2)` extension need not glue a smooth
circle. The cover-based 2006/2007 publications do not, by themselves, resolve
the domain/locality/equivalence defects listed below. No revised general
classification is claimed, and the TeX manuscript has not been altered.

## Original editorial review

Reviewed 2026-07-23. This is an editorial and mathematical triage, not a substitute for specialist peer review.

## Verdict

- **Best category:** research prospect / technical web manuscript
- **Journal merit as written:** low
- **Journal merit after reconstruction:** potentially moderate
- **Expository merit:** moderate
- **Priority:** high-risk, high-effort

The potentially distinctive idea is physical invariance under the arbitrary cut used to represent a multiply connected configuration space. That is a good organizing question. The present draft, however, is not yet a valid classification of self-adjoint Hamiltonians: it begins mid-argument, relies on undefined equivalence notions, and treats operator domains too informally.

## Standaloneness

**Assessment: poor.** The opening assumes \(Q\), \(E\), Bohmian velocities, and several earlier approaches. References to `ie:rbe`, `ie:rse`, `ie:ve`, and `s:fb` are unresolved. “Cut,” “BV-equivalence,” and “cut independence” become precise only gradually, and the reader is expected to know why equality of velocity fields is the chosen physical criterion.

The final functional-analytic supplement is too short and too late to support the main claims. It should become the foundation of the paper rather than an appendix.

## Correctness

Major repair is required.

- For the Laplacian on an interval, a standard self-adjoint domain is an \(H^2\) domain with endpoint value and derivative conditions. Requiring matching of all derivatives on \(C^\infty\) functions may describe a smooth core, but it is not itself the general self-adjoint domain.
- The four-parameter family on an interval is normally encoded by \(U(2)\). The manuscript should derive its chosen parametrization and state which regularity and endpoint trace theorem it uses.
- \(C_0^\infty([0,2\pi])\) is ambiguous in this context; functions compactly supported away from the endpoints do not encode periodic or twisted boundary behavior.
- A domain being invariant under a proposed evolution does not prove that the differential operator on that domain is self-adjoint. Use a closed quadratic form, boundary form, boundary triple, or unitary equivalence to a known self-adjoint operator.
- Equivariant functions on an infinite cover are not generally square-integrable over the whole cover. The Hilbert norm should be taken on a fundamental domain, or the formulation should use sections of the corresponding flat bundle.
- “Same Bohmian velocity” does not immediately imply that the intertwining unitary is pointwise multiplication. Nodes, equality almost everywhere, support, locality, and position observables must be handled.
- Existence and admissibility of cuts on a general manifold need hypotheses. Minimality and completeness of the cut complement are currently informal.
- The claimed characterization of all cut-independent extensions is therefore not established.

Modern extension theory supplies an appropriate language; for example, [Quasi boundary triples and semibounded self-adjoint extensions](https://arxiv.org/abs/1504.03885) shows the kind of domain-level framework needed for elliptic operators, though the paper will also need sources specific to Laplace-type operators on cut manifolds.

## Understandability

The circle example is intuitive and should be retained. After that, the paper alternates among topology, Bohmian equivalence, and operator theory without identifying which statements are definitions, conjectures, or proved theorems. A diagram relating the uncut manifold, cut manifold, universal cover, and boundary trace spaces would materially help.

## Related work and novelty

Self-adjoint boundary conditions and boundary triples are mature theories, while the later Taylor-coauthored multiply-connected-space paper already treats topological factors. The possible novelty is the *naturality under changing a cut* as a selection rule. A literature review must determine whether this is already implicit in gluing laws for elliptic operators or quantum graphs before making a priority claim.

## Work needed

1. Start with a precise circle theorem, including Hilbert space, minimal operator, adjoint, boundary form, and all self-adjoint extensions.
2. Define cut independence as an invariance or naturality property under changing the fundamental domain.
3. State the comparison category: unitary equivalence of quantum triples \((\mathscr H,H,Q)\), equality of Bohmian flows, or both.
4. Rebuild the general theorem using Sobolev trace spaces and boundary-unitary data.
5. Prove that the cover/flat-bundle construction gives self-adjoint operators and then characterize which boundary data arise from it.
6. Compare the resulting theorem explicitly with the later topology papers, especially [Quantum Mechanics in Multiply-Connected Spaces](https://arxiv.org/abs/quant-ph/0506173).

## Publication recommendation

Do not submit the current manuscript. As a web document, label it “research notes” and separate proved results from conjectures. A journal paper could emerge if the cut-independence condition is made invariant, the self-adjoint classification is rigorously proved, and the result is shown not to be an immediate restatement of flat-bundle quantization.
