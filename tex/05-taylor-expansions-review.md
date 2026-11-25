# Review: Taylor Expansions of Mappings between Manifolds

## Findings from the November 25, 2026 HTML revision

The [revised paper](../docs/taylor-maps.html) retains the 2003 chapter’s
comparison problem, ordered chain rule, and all-order sufficient conditions.
The original TeX and the July triage below provide the historical baseline.

| Location in the dissertation | Finding | Resolution in the paper |
| --- | --- | --- |
| §6.4, tensors in a normal coframe | An order-\(n\) derivative of a covariant \(\ell\)-tensor has \(n+\ell\) slots. The displayed corollary supplies one extra vector. | Contract the tensor slots and derivative slots with the radial velocity. |
| §§6.8–6.9, flat subspaces | The identity differential of the exponential rules out including order one in the vanishing condition. The sufficient-condition proof assumes that lower logarithm derivatives belong to the span of the covariant jets. | Start at order two. Establish membership inductively using the one-block term in the chain rule. |
| §6.9, geodesic reparametrizations | At a stop, a curve in one geodesic can have zero velocity and nonzero acceleration. A pointwise proportionality factor need not be differentiable. | Use image containment for the all-order conclusion. Use the proportional-acceleration characterization on regular arcs. |
| §6.10, third and fourth derivatives | The specialized cubic formula changes two velocity slots to acceleration slots. This introduces a spurious possible cubic discrepancy in the torsion-free case. | The actual cubic difference is half the target torsion applied to velocity and acceleration. For a torsion-free target the fourth derivative difference is \(R(a,b)a\), covariant minus logarithmic. |
| §6.10, proposed converse | Agreement for one curve can coexist with a non-flat span of its jets. | [Two explicit counterexamples](../docs/taylor-maps.html#converse) include an analytic Riemannian metric. The mixed fifth derivative of the exponential has a nonzero component even though every derivative sampled by the curve agrees. |
| §6.11 and the radial-frame appendix | The section polynomial drops its factorials. Parallel transport over a closed base geodesic can have holonomy. The appendix also identifies an ordered Hessian with the full curvature action. | Use a short base arc, specify the total-space connection by the connector splitting, and insert \(1/k!\). With zero symmetric Hessian, the antisymmetrized difference, twice the appropriate ordered Hessian, gives the curvature action at the center. |

The [sphere calculation](../docs/sphere-latitude.html) obtains both jets
independently. At 45° the northward fourth derivatives are zero for the
logarithm and −1/4 for the covariant derivative. The [ring torus](../docs/ring-torus.html)
compares the predicted sign and magnitude with a numerical boundary-value
calculation. The literature comparison establishes precedents for the
transported-section formula and normal-coordinate methods. Publication
priority for the comparison theorem and counterexamples remains undetermined.

## Original editorial review

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
