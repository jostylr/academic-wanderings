import { pointerState } from "./conversion-model.mjs";

const lab = document.querySelector("#conversion-lab");
const controls = lab.querySelectorAll("input[type=range]");
const canvas = lab.querySelector("canvas");
const context = canvas.getContext("2d");

function draw() {
  const [angle, detuning, quantile, time] = Array.from(controls, input => input.valueAsNumber);
  for (const input of controls) lab.querySelector(`output[for="${input.id}"]`).value = input.valueAsNumber.toFixed(2);
  const at = t => pointerState(t, Math.PI * angle, Math.PI * detuning, quantile);
  const state = at(time);
  const stage = time < 1 ? "Prepared in A" : time < 2 ? "Pulse applied" : time < 4 ? "Pointer packets separating" : "Record held";
  lab.querySelector("#pulse-reading").textContent = `${stage}. B population ${(100 * state.b).toFixed(1)}%. Pointer position ${state.position.toFixed(2)}. B weight at this position ${(100 * state.localWeight).toFixed(1)}%.`;
  const width = canvas.clientWidth, height = canvas.clientHeight;
  if (!width || !height) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.scale(ratio, ratio);
  const style = getComputedStyle(lab);
  const ink = style.color, accent = style.getPropertyValue("--link");
  const x = t => 30 + (width - 44) * t / 5;
  const y = value => height / 2 - (height - 48) * value / 24;
  context.font = "14px system-ui";
  context.fillStyle = ink;
  context.strokeStyle = ink;
  context.lineWidth = 1;
  for (const t of [0, 1, 2, 4, 5]) {
    context.beginPath();
    context.moveTo(x(t), 14);
    context.lineTo(x(t), height - 24);
    context.setLineDash([2, 5]);
    context.stroke();
    context.fillText(t, x(t) - 4, height - 5);
  }
  for (const q of [-8, 0, 8]) context.fillText(q, 3, y(q) + 4);
  context.setLineDash([]);
  context.strokeStyle = accent;
  context.lineWidth = 2.5;
  context.beginPath();
  for (let i = 0; i <= 160; i++) {
    const t = time * i / 160;
    const pointY = y(at(t).position);
    if (i === 0) context.moveTo(x(t), pointY);
    else context.lineTo(x(t), pointY);
  }
  context.stroke();
  context.fillStyle = accent;
  context.beginPath();
  context.arc(x(time), y(state.position), 4, 0, 2 * Math.PI);
  context.fill();
}

for (const input of controls) input.addEventListener("input", draw);
lab.hidden = false;
draw();
window.addEventListener("resize", draw);
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);
