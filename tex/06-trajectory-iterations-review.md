# Review: Two Algorithms for Exact Quantum Dynamics from Trajectories

Reviewed 2026-07-23. This is an editorial and mathematical triage, not a substitute for specialist peer review.

## Verdict

- **Best category:** research prospect with computational potential
- **Journal merit as written:** low
- **Journal merit after revision:** potentially high if correctness and convergence are established
- **Expository merit:** moderate
- **Priority:** high, but only with full re-derivation and numerical tests

The proposed fixed-point/iteration viewpoint for solving the quantum Hamilton–Jacobi and continuity system along trajectories is potentially interesting. The draft offers two algorithms, fixed-point observations, special examples, a propagator connection, and a PDE for the Bohmian velocity. At present the title’s word “Exact” is not justified by a convergence theorem or reliable calculations.

## Standaloneness

**Assessment: weak to moderate.** There is no abstract, the opening reads as an extracted chapter, and references to `a:app7`, `c:geom`, `c:manpart`, and `c:taylor` remain unresolved. Definitions of \(R,S,Q\), the phase convention, and the trajectory map must be collected before the algorithms.

The reader cannot presently tell whether an “algorithm” is a formal iteration, a convergent analytic scheme, or a numerical method with a discretization.

## Correctness

There are serious formula-level problems.

- For a Gaussian \(R(x)=\exp[-(x-a)^2/2]\), \(R''/R=(x-a)^2-1\), not \((x-a)^2+1\). A constant may disappear after taking a force gradient, but it matters in the quantum potential and phase.
- The harmonic-oscillator propagator formula has inconsistent parentheses and factors of \(i\), \(\hbar\), and \(\omega\). Later calculations contain \(y_0\) where \(y_0^2\) is expected and \(\cos(\omega^2t)\) where \(\cos(\omega t)\) is expected.
- The phase \(S\) sometimes appears to contain a factor \(m/\hbar\) despite the convention \(\psi=R e^{iS/\hbar}\), suggesting double scaling.
- The Ermakov–Pinney-type equation changes constants/variables between statement and derivation.
- The full velocity PDE contains duplicated terms, unmatched grouping, and expressions whose tensor types do not agree. It cannot be relied on without derivation from scratch.
- An exact fixed point does not make an iteration exact in practice. One needs existence, uniqueness, convergence, preservation of positivity/equivariance, and behavior near nodes/caustics.

The numerical context is already substantial. Trahan, Wyatt, and Poirier’s [Multidimensional quantum trajectories: applications of the derivative propagation method](https://pubmed.ncbi.nlm.nih.gov/15945669/) and Deckert, Dürr, and Pickl’s [Quantum Dynamics with Bohmian Trajectories](https://arxiv.org/abs/quant-ph/0701190) are directly relevant. Babyuk and Wyatt’s [node-problem study](https://pubmed.ncbi.nlm.nih.gov/15538843/) highlights a difficulty the draft must address. Recent work such as [Quantum Dynamics via Score Matching on Bohmian Trajectories](https://arxiv.org/abs/2604.25137) shows that the computational topic remains active but has moved considerably.

## Understandability

The “algorithms in short” subsection is the right core and should move to the start. Each iteration should be shown in a boxed input/output definition, followed by one exactly solvable test. Long chain-rule calculations should go into an appendix or machine-verifiable notebook.

## Related work and novelty

Quantum hydrodynamic trajectory algorithms, derivative propagation, complex-action methods, and Bohmian grids already pursue closely related goals. The manuscript predates some of the linked literature, but journal novelty is judged against what is now known. Its distinctive contribution would need to be a provably convergent update rule, a stability advantage, or a demonstrably better numerical regime—not merely rewriting Schrödinger evolution as an exact infinite hierarchy.

## Work needed

1. Re-derive the Madelung equations and both iterations in one dimensional convention.
2. Validate every example against free-particle and harmonic-oscillator closed forms.
3. Use symbolic algebra to verify the velocity PDE at low dimension/order.
4. Prove at least a local convergence result in a specified norm, or honestly frame the algorithms as heuristic iterations.
5. Implement numerical experiments measuring error, stability, node sensitivity, and cost against direct Schrödinger evolution.
6. Compare the update rule with quantum trajectory, derivative-propagation, quantum hydrodynamic, and complex-action methods.
7. Replace “exact” in the title unless exactness means a proved convergent limit.

## Publication recommendation

This could become a journal paper, but only after a ground-up mathematical and computational rebuild. The publishable object would be a precisely defined iteration plus convergence or stability analysis and reproducible benchmarks. Until then, retain it as a research web manuscript with explicit warnings that the displayed formulas have not been validated.
