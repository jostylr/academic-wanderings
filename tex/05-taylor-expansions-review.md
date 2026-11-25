# Review: Taylor Expansions of Mappings between Manifolds

Reviewed 2026-07-23. This is an editorial and mathematical triage, not a substitute for specialist peer review.

## Verdict

- **Best category:** research manuscript after major reconstruction
- **Journal merit as written:** low
- **Journal merit after revision:** potentially moderate to high if one new theorem survives comparison with the literature
- **Expository merit:** moderate
- **Priority:** highest for specialist mathematical review

This is the most ambitious pure-mathematics draft in the collection. It develops covariant higher derivatives, a partition form of the chain rule, Taylor expansions through exponential maps, “covariant normality,” geodesic submanifolds, and a connection on a vector bundle viewed as a manifold. There may be a publishable nucleus, but the current scope makes it hard to determine which statements are new, which are known covariant Faà di Bruno formulas, and which depend on an especially chosen connection.

## Standaloneness

**Assessment: moderate.** The paper has its own progression but still refers to thesis chapters and an extracted frame-field appendix (`a:difgeom`, `c:algo`). It lacks an abstract that states the principal theorem. Several proof environments contain warnings, diagrams, or informal discussion rather than proofs.

The notation \(f_*TN\) appears where \(f^*TN\), the pullback tangent bundle over the source, is normally intended. This is more than cosmetic because it affects the type of every covariant derivative.

## Correctness

The partition structure of the higher chain rule is standard Faà di Bruno territory. A closely related modern reference is Clark and Houssineau’s [Faà di Bruno's formula for chain differentials](https://arxiv.org/abs/1310.2833); Levy’s [Why do partitions occur in Faà di Bruno's chain rule for higher derivatives?](https://arxiv.org/abs/math/0602183) is also relevant. For covariant expansions of the exponential map, compare Gavrilov’s [The Taylor series related to the differential of the exponential map](https://arxiv.org/abs/1205.2868).

Specific concerns:

- The manuscript needs to fix whether the source and target connections are torsion-free. Normal coordinates obtained from an affine exponential map do not erase torsion, and symmetrized derivatives lose information carried by antisymmetric parts.
- Several corollaries appear to have mismatched numbers of vector arguments or indices. Every chain-rule formula should be type-checked at orders two, three, and four.
- The relation between ordinary Taylor coefficients in exponential coordinates and symmetrized covariant derivatives is plausible under suitable hypotheses, but the remainder term, domain of the logarithm, and locality must be stated.
- “Covariant normality” is not standard terminology. The definition must be invariant and its dependence on the chosen connections made explicit.
- “All maps into a flat target are covariantly normal” needs exact local hypotheses and a proof that the relevant exponential coordinates are affine in the required sense.
- The connection built on the total space of a vector bundle is a particular construction, not a canonical connection determined without choices. The claim that its geodesics are parallel-transported fiber vectors over base geodesics must follow from a fully specified horizontal/vertical connection.
- The later claim that sections are covariantly normal risks becoming tautological if the total-space connection was designed to make it so.
- The “failure” section contains conjectural reasoning and incomplete cases; it should be labeled accordingly.

## Understandability

The diagrams of partitions are promising, but the paper introduces too many goals before showing a decisive example. A worked third-order map \(M\to N\), followed by the invariant general formula, would orient the reader. Terms such as “primary tools” and “failure of covariant normality” need concise propositions explaining why the reader should care.

## Related work and novelty

Faà di Bruno partition formulas, jets, covariant Taylor series, normal coordinates, and curvature expansions are all established. The cited Clark–Houssineau, Levy, and Gavrilov papers are close starting points rather than a complete search. The novelty question turns on whether “covariant normality” gives a new invariant theorem, and whether the total-space connection construction differs substantively from known horizontal and complete lifts.

## Work needed

1. Identify one main theorem and put its exact hypotheses and novelty claim in the abstract.
2. Normalize bundles and types: \(df\), \(f^*TN\), induced connections, symmetrization, and torsion conventions.
3. Verify low-order formulas by local coordinates or symbolic tensor bookkeeping.
4. Separate established covariant Faà di Bruno/Taylor material from new “normality” results.
5. Give rigorous remainder estimates or explicitly describe the work as a formal jet expansion.
6. Define the total-space connection in full and compare it with standard complete/horizontal lifts.
7. Ask a differential geometer to audit the main theorem before polishing the exposition.

## Publication recommendation

Do not reduce this immediately to a web-only note: it is one of the few drafts with plausible original mathematical content. First perform a novelty and proof audit. If “covariant normality” yields a genuinely invariant characterization not present in the jet/exponential-map literature, extract a focused journal paper. Otherwise, reshape it into a careful expository monograph chapter on covariant Faà di Bruno formulas and exponential-coordinate Taylor series.
