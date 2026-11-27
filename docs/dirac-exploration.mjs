import { diracState } from "./quantum-models.mjs";

const lab = document.getElementById("dirac-lab");
const momentum = lab.querySelector("#dirac-momentum");
const phase = lab.querySelector("#dirac-phase");
const number = value => (Math.abs(value) < 0.00005 ? 0 : value).toFixed(4);

function update() {
  const kappa = momentum.valueAsNumber;
  const delta = phase.valueAsNumber;
  const state = diracState(kappa, delta);
  lab.querySelector("#dirac-momentum-value").value = kappa.toFixed(2);
  lab.querySelector("#dirac-phase-value").value = `${delta}°`;
  lab.querySelector("#dirac-a").textContent = number(state.a);
  lab.querySelector("#dirac-b").textContent =
    `${number(state.bReal)} ${state.bImaginary < -0.00005 ? "−" : "+"} ${number(Math.abs(state.bImaginary))}i`;
  lab.querySelector("#dirac-density").textContent = number(state.density);
  lab.querySelector("#dirac-velocity").textContent = number(state.velocity);
  lab.querySelector("#dirac-reference").textContent = number(state.referenceVelocity);
  lab.querySelector("#dirac-positive").textContent = `${(100 * state.positiveWeight).toFixed(1)}%`;
  lab.querySelector("#dirac-state-note").textContent = state.positiveWeight > 1 - 1e-12
    ? "This is the positive-energy plane-wave spinor."
    : "This is a superposition of positive- and negative-energy spinors. The displayed current is its value at the selected instant.";
  const x = 220 + 190 * state.velocity;
  lab.querySelector("#current-vector").setAttribute("x2", x);
  lab.querySelector("#current-tip").setAttribute("cx", x);
  lab.querySelector("#current-diagram-desc").textContent =
    `The local velocity along z is ${number(state.velocity)} times the speed of light.`;
}

momentum.addEventListener("input", update);
phase.addEventListener("input", update);
lab.querySelector("#dirac-reset").addEventListener("click", () => {
  momentum.value = 1;
  phase.value = 0;
  update();
});
update();
lab.hidden = false;
