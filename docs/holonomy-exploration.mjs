import { circleState } from "./holonomy-models.mjs";

const lab = document.getElementById("holonomy-lab");
const controls = Object.fromEntries(["alpha", "mode", "radius", "time", "seam"]
  .map(name => [name, lab.querySelector(`#circle-${name}`)]));
const format = value => (Math.abs(value) < 0.00005 ? 0 : value).toFixed(4);
const complex = ([real, imaginary]) =>
  `${format(real)} ${imaginary < -0.00005 ? "−" : "+"} ${format(Math.abs(imaginary))}i`;

function update() {
  const alpha = controls.alpha.valueAsNumber;
  const n = controls.mode.valueAsNumber;
  const radius = controls.radius.valueAsNumber;
  const time = controls.time.valueAsNumber;
  const seamDegrees = Number(controls.seam.value);
  const state = circleState({ alpha, n, radius, time, seamDegrees });
  for (const name of ["alpha", "mode", "radius", "time"]) {
    lab.querySelector(`#circle-${name}-value`).value = name === "mode"
      ? String(controls[name].valueAsNumber) : controls[name].valueAsNumber.toFixed(2);
  }
  for (const [id, value] of Object.entries({
    energy: state.energy, "cover-velocity": state.coverVelocity,
    "connection-velocity": state.connectionVelocity, "arc-speed": state.arcSpeed,
    density: state.density, probability: state.probability,
  })) lab.querySelector(`#circle-${id}`).textContent = format(value);
  lab.querySelector("#circle-twist").textContent = complex(state.twist);
  lab.querySelector("#circle-holonomy").textContent = complex(state.holonomy);
  lab.querySelector("#circle-angle").textContent = `${format(state.angle)} rad`;
  lab.querySelector("#circle-seam-angle").textContent = `${format(state.seamAngle)} rad`;
  const particle = lab.querySelector("#circle-particle");
  particle.setAttribute("cx", 220 + 105 * state.point[0]);
  particle.setAttribute("cy", 145 - 105 * state.point[1]);
  const cut = lab.querySelector("#circle-cut");
  cut.setAttribute("x2", 220 + 115 * Math.cos(seamDegrees * Math.PI / 180));
  cut.setAttribute("y2", 145 - 115 * Math.sin(seamDegrees * Math.PI / 180));
  lab.querySelector("#circle-desc").textContent =
    `At time ${time.toFixed(2)}, the particle is at physical angle ${format(state.angle)} radians. The seam is at ${seamDegrees} degrees. Both representations give angular velocity ${format(state.coverVelocity)}.`;
}

for (const [name, control] of Object.entries(controls)) {
  control.addEventListener(name === "seam" ? "change" : "input", update);
}
lab.querySelector("#circle-reset").addEventListener("click", () => {
  for (const name of ["alpha", "mode", "radius", "time"]) controls[name].value = controls[name].defaultValue;
  controls.seam.value = "0";
  update();
});
update();
lab.hidden = false;
