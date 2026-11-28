import { packetAt, speciesPackets, traceIdentity } from "./identity-models.mjs";

const lab = document.getElementById("species-lab");
const find = id => lab.querySelector(`#species-${id}`);
const displacement = find("jiggle"), time = find("time"), comparison = find("compare");
const format = value => (Math.abs(value) < 0.0005 ? 0 : value).toFixed(3);
const scale = 30;
const screen = ([x, y]) => [380 + scale * x, 185 - scale * y];
const outcome = state => state.weight >= 0.99 ? "A-like (A weight ≥ 99%)"
  : state.reverseWeight >= 0.99 ? "B-like (B weight ≥ 99%)" : "No dominant assignment";
let selected, counterfactual;

function recompute() {
  selected = traceIdentity({ displacement: displacement.valueAsNumber });
  counterfactual = traceIdentity({ displacement: -displacement.valueAsNumber });
  draw();
}

function draw() {
  const index = Math.round(time.valueAsNumber / 0.005);
  const frame = selected[index];
  find("jiggle-value").value = displacement.valueAsNumber.toFixed(3);
  find("time-value").value = frame.time.toFixed(2);
  for (const j of [0, 1]) {
    const path = frames => frames.slice(0, index + 1).map((f, k) =>
      `${k ? "L" : "M"}${screen(f.points[j]).map(format).join(",")}`).join(" ");
    find(`path-${j}`).setAttribute("d", path(selected));
    find(`shadow-${j}`).setAttribute("d", path(counterfactual));
    find(`shadow-${j}`).style.display = comparison.checked ? "" : "none";
    const [x, y] = screen(frame.points[j]);
    if (j === 0) {
      find("point-0").setAttribute("cx", x);
      find("point-0").setAttribute("cy", y);
    } else {
      find("point-1").setAttribute("x", x - 5);
      find("point-1").setAttribute("y", y - 5);
    }
  }
  for (const [j, name] of ["a", "b"].entries()) {
    const packet = speciesPackets()[j];
    const [x] = screen([packet.velocity[0] * frame.time, 0]);
    const radius = 2 * Math.sqrt(packetAt([0, 0], frame.time, packet).variance) * scale;
    for (const [key, value] of Object.entries({ cx: x, rx: radius, ry: radius })) {
      find(`cloud-${name}`).setAttribute(key, value);
    }
    find(`label-${name}`).setAttribute("x", x);
    // Separate the labels even when the spatial clouds coincide at t = 0.
    find(`label-${name}`).setAttribute("y", j ? 334 : 40);
  }
  find("weight").textContent = `${(100 * frame.weight).toFixed(3)}% (rounded)`;
  find("velocity").textContent = `(${frame.velocities[0].map(format).join(", ")})`;
  find("outcome").textContent = outcome(selected.at(-1));
  find("counterfactual").textContent = outcome(counterfactual.at(-1));
  find("separation").textContent = format(Math.hypot(...frame.points[0].map((x, i) => x - frame.points[1][i])));
  const final = selected.at(-1);
  find("tail").textContent = Math.min(final.weight, final.reverseWeight).toExponential(3);
  const unwanted = Math.min(frame.weight, frame.reverseWeight);
  const channelDifference = Math.hypot(...frame.branchVelocities[0][0]
    .map((u, i) => u - frame.branchVelocities[1][0][i]));
  find("error").textContent = unwanted <= 0.01
    ? (unwanted * channelDifference).toExponential(3) : "Overlap: no 99% dominant assignment";
  find("balanced-note").hidden = displacement.valueAsNumber !== 0;
  find("desc").textContent = `At time ${frame.time.toFixed(2)}, the round tracked point has A assignment weight ${(100 * frame.weight).toFixed(2)} percent. Its selected run ends ${outcome(final)}. The opposite jiggle ends ${outcome(counterfactual.at(-1))}.`;
}

displacement.addEventListener("input", recompute);
time.addEventListener("input", draw);
comparison.addEventListener("change", draw);
for (const [name, value] of [["negative", -0.04], ["positive", 0.04], ["balanced", 0]]) {
  find(name).addEventListener("click", () => {
    displacement.value = value;
    recompute();
  });
}
find("reset").addEventListener("click", () => {
  displacement.value = displacement.defaultValue;
  time.value = time.defaultValue;
  comparison.checked = comparison.defaultChecked;
  recompute();
});
recompute();
lab.hidden = false;
