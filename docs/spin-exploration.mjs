import { spinState } from "./quantum-models.mjs";

const lab = document.getElementById("spin-lab");
const rotation = lab.querySelector("#spin-angle");
const analyzer = lab.querySelector("#analyzer-angle");
const number = value => (Math.abs(value) < 0.0005 ? 0 : value).toFixed(3);

function update() {
  const alpha = rotation.valueAsNumber;
  const theta = analyzer.valueAsNumber;
  const state = spinState(alpha, theta);
  lab.querySelector("#spin-angle-value").value = `${alpha}°`;
  lab.querySelector("#analyzer-angle-value").value = `${theta}°`;
  lab.querySelector("#spin-components").textContent = `(${number(state.a)}, ${number(state.b)})`;
  for (const key of ["plus", "minus", "bright"]) {
    lab.querySelector(`#spin-${key}`).textContent = `${(100 * state[key]).toFixed(1)}%`;
  }
  const spinX = 160 + 84 * state.spin.x;
  const spinY = 125 - 84 * state.spin.z;
  const spinLine = lab.querySelector("#spin-vector");
  spinLine.setAttribute("x2", spinX);
  spinLine.setAttribute("y2", spinY);
  lab.querySelector("#spin-tip").setAttribute("cx", spinX);
  lab.querySelector("#spin-tip").setAttribute("cy", spinY);
  const analyzerLine = lab.querySelector("#analyzer-vector");
  analyzerLine.setAttribute("x2", 160 + 95 * state.analyzer.x);
  analyzerLine.setAttribute("y2", 125 - 95 * state.analyzer.z);
  lab.querySelector("#spin-diagram-desc").textContent =
    `State rotation ${alpha} degrees; analyzer ${theta} degrees. Solid blue: spin direction. Dashed: analyzer plus direction.`;
}

rotation.addEventListener("input", update);
analyzer.addEventListener("input", update);
lab.querySelector("#spin-reset").addEventListener("click", () => {
  rotation.value = 0;
  analyzer.value = 0;
  update();
});
update();
lab.hidden = false;
