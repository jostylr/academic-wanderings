# Review: On Recovering a Wave Function from Bohmian Velocities

Reviewed 2026-07-23. This is an editorial and mathematical triage, not a substitute for specialist peer review.

## Verdict

- **Best category:** conjecture/problem note
- **Journal merit as written:** none
- **Journal merit after revision:** potentially moderate if a rigorous generic uniqueness theorem or counterexample is obtained
- **Web merit:** good as an openly labeled research question
- **Priority:** medium

This note asks a sharp inverse question: when does a Bohmian velocity field over a time interval determine the initial wave function? The question is more interesting than the present argument. At only a few pages, the draft offers heuristics rather than a defined theorem.

## Standaloneness

**Assessment: poor.** It starts from a PDE in the trajectory chapter and refers to `c:algo` without restating it. The potential, configuration space, Hamiltonian, regularity, nodal set, equivalence up to global phase/normalization, and meaning of “same velocity field” are not specified.

The paper must distinguish velocity at one time from the full spacetime velocity field. At one time,
\[
v^\psi=\frac{\hbar}{m}\operatorname{Im}\frac{\nabla\psi}{\psi}
\]
determines the phase gradient on each connected component of the non-nodal set, but it does not determine the amplitude.

## Correctness

The current heuristic contains a definite spectral error and several unsupported genericity claims.

- Eigenfunctions with **distinct** eigenvalues of a self-adjoint operator are orthogonal. Two vectors with the same eigenvalue need not be orthogonal, though an orthogonal basis may be chosen within the eigenspace.
- Uniqueness and strict positivity of a ground state require hypotheses such as connectedness, ellipticity/positivity-improving dynamics, and appropriate boundary or confining conditions.
- The statement that two positive solutions differ by “codimension one” is not mathematically defined.
- A generic complex function has a real-codimension-two zero set only under transversality and dimensional hypotheses. Schrödinger evolution need not instantly turn every exceptional nodal set into a generic one.
- The equality of velocities is undefined at nodes and should be posed almost everywhere with respect to an identified measure.
- Multiplying \(\psi\) by a nonzero constant leaves the velocity unchanged; normalization removes the modulus but a global phase remains. Disconnected nodal components may initially permit separate phase constants.
- The relation \(\Delta R_1/R_1=\Delta R_2/R_2+C\) needs to be re-derived with units and assumptions. Equality of velocities through time imposes Schrödinger compatibility, not just an instantaneous elliptic equation.

The bibliography references Schneider’s thesis and Bacciagaluppi’s work on symmetry postulates, but the draft does not explain how they prove this particular inverse statement. A targeted search did not reveal a standard theorem exactly matching the proposed “generic full-time uniqueness,” so the problem may be worth pursuing; that is not evidence that it is new.

## Understandability

The intuition about phase, amplitude, stationary states, and nodal sets can be made compelling if presented as a sequence of increasingly strong data:

1. velocity at one time;
2. velocity plus density at one time;
3. velocity for all time under a known Hamiltonian.

That structure would expose both trivial nonuniqueness and the genuinely difficult case.

## Related work and novelty

Madelung reconstruction from density and current, phase retrieval, unique continuation, and inverse Schrödinger problems are neighboring literatures; the present draft cites none of them. The exact problem—injectivity of the full Bohmian velocity history for a known Hamiltonian—was not located as a standard theorem in the targeted search. That makes a deeper search worthwhile, but novelty should remain an open question until the problem and genericity topology are fixed.

## Work needed

1. Define the inverse map, its domain/codomain, and equivalence up to normalized global phase.
2. Prove the elementary one-time reconstruction statements on nodal components.
3. Formulate the full-time conjecture for a specific class of Schrödinger operators.
4. Search systematically for counterexamples: stationary real states, degeneracies, symmetries, disconnected domains, and wave functions with persistent nodal hypersurfaces.
5. Replace informal codimension arguments with a transversality or unique-continuation theorem.
6. Verify what Schneider and Bacciagaluppi actually establish and cite the exact propositions.
7. Only then attempt a generic injectivity theorem in a specified topology.

## Publication recommendation

Post a corrected version on the web as “A Bohmian inverse problem” with conjectures and known obstructions clearly separated. A journal paper would require a rigorous uniqueness theorem, a meaningful genericity result, or a classification of counterexamples. The present two-paragraph argument is not publishable research, but the question may be.
