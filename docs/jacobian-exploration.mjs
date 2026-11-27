import { flowState, focusState } from "./transport-models.mjs";

const flowLab = document.getElementById("flow-lab");
const controls = Object.fromEntries([
  ["d", "expansion"], ["s", "strain"], ["k", "shear"], ["t", "time"],
].map(([parameter, name]) => [parameter, flowLab.querySelector(`#flow-${name}`)]));
const square = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
const format = value => (Math.abs(value) < 0.00005 ? 0 : value).toFixed(4);

function updateFlow() {
  const parameters = Object.fromEntries(Object.entries(controls).map(([key, input]) => [key, input.valueAsNumber]));
  const state = flowState(parameters);
  for (const input of Object.values(controls)) {
    flowLab.querySelector(`#${input.id}-value`).value = input.valueAsNumber.toFixed(2);
  }
  for (const [id, value] of Object.entries({
    trace: state.divergence, area: state.jacobian, predicted: state.predictedJacobian,
    density: state.density, mass: state.mass, halves: state.halfJacobianProduct,
  })) flowLab.querySelector(`#flow-${id}`).textContent = format(value);
  state.matrix.forEach((row, i) => row.forEach((value, j) => {
    flowLab.querySelector(`#flow-f${i + 1}${j + 1}`).textContent = format(value);
  }));
  const image = square.map(([x, y]) => [
    state.matrix[0][0] * x + state.matrix[0][1] * y,
    state.matrix[1][0] * x + state.matrix[1][1] * y,
  ]);
  const extent = Math.max(1, ...image.flat().map(Math.abs)) * 1.25;
  const scale = 150 / extent;
  const points = polygon => polygon.map(([x, y]) => `${220 + x * scale},${170 - y * scale}`).join(" ");
  flowLab.querySelector("#flow-original").setAttribute("points", points(square));
  flowLab.querySelector("#flow-image").setAttribute("points", points(image));
  flowLab.querySelector("#flow-scale").textContent =
    `Vertical plotting range: −${extent.toFixed(2)} to ${extent.toFixed(2)}. The dashed initial square has area 1.`;
  flowLab.querySelector("#flow-desc").textContent =
    `The filled cell has area ${format(state.jacobian)} and density ${format(state.density)}. The outlined initial square has area one. Both use the same scale.`;
}

Object.values(controls).forEach(input => input.addEventListener("input", updateFlow));
flowLab.querySelector("#flow-reset").addEventListener("click", () => {
  for (const input of Object.values(controls)) input.value = input.defaultValue;
  updateFlow();
});
updateFlow();
flowLab.hidden = false;

const focusLab = document.getElementById("focus-lab");
const focusTime = focusLab.querySelector("#focus-time");
const labels = [-1, -0.5, 0, 0.5, 1];
const svgNamespace = "http://www.w3.org/2000/svg";
const timeX = t => 40 + 260 * t;
const positionY = position => 140 - 90 * position;
const markers = [];
for (const label of labels) {
  const line = document.createElementNS(svgNamespace, "line");
  for (const [key, value] of Object.entries({ x1: timeX(0), x2: timeX(1.5), y1: positionY(label), y2: positionY(-0.5 * label) })) {
    line.setAttribute(key, value);
  }
  line.setAttribute("class", "focus-path");
  focusLab.querySelector("#focus-paths").append(line);
  const point = document.createElementNS(svgNamespace, "circle");
  point.setAttribute("r", 4);
  point.setAttribute("class", "spin-tip");
  focusLab.querySelector("#focus-points").append(point);
  markers.push(point);
}

function updateFocus() {
  const t = focusTime.valueAsNumber;
  const state = focusState(t);
  focusLab.querySelector("#focus-time-value").value = t.toFixed(2);
  focusLab.querySelector("#focus-jacobian").textContent = format(state.jacobian);
  focusLab.querySelector("#focus-length").textContent = format(state.length);
  focusLab.querySelector("#focus-density").textContent = state.singular ? "No finite reconstruction" : format(state.densityRatio);
  focusLab.querySelector("#focus-velocity").textContent = state.singular ? "Undefined at the focus" : format(state.velocityGradient);
  const message = {
    before: "Before the focus, the position map is invertible and the density ratio is its reciprocal length factor.",
    at: "At the focus, J = 0. The inverse map, finite reconstructed density, and single-valued position velocity fail here.",
    after: "After the focus, the labelled Newton family reverses orientation. This continues the trajectories, not a smooth position-velocity flow through time one.",
  }[state.stage];
  focusLab.querySelector("#focus-note").textContent = message;
  focusLab.querySelector("#focus-desc").textContent = `Selected time ${t.toFixed(2)}. ${message}`;
  const x = timeX(t);
  for (const key of ["x1", "x2"]) focusLab.querySelector("#focus-cursor").setAttribute(key, x);
  markers.forEach((point, index) => {
    point.setAttribute("cx", x);
    point.setAttribute("cy", positionY(state.jacobian * labels[index]));
  });
}

focusTime.addEventListener("input", updateFocus);
focusLab.querySelector("#focus-reset").addEventListener("click", () => {
  focusTime.value = focusTime.defaultValue;
  updateFocus();
});
updateFocus();
focusLab.hidden = false;
