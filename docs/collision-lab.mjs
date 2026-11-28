import { visibleFlux } from "./collision-model.mjs";

const lab = document.querySelector("#collision-lab");
const energy = lab.querySelector("#energy");
const barrier = lab.querySelector("#barrier");
const mixing = lab.querySelector("#mixing");
const reading = lab.querySelector("#flux-reading");
const canvas = lab.querySelector("canvas");
const ctx = canvas.getContext("2d");
const maxEnergy = Number(energy.max);

function draw() {
  for (const input of [energy, barrier, mixing]) {
    lab.querySelector(`output[for="${input.id}"]`).value = input.valueAsNumber.toFixed(2);
  }
  const selected = energy.valueAsNumber;
  const at = value => visibleFlux(value, barrier.valueAsNumber, mixing.valueAsNumber);
  const fraction = at(selected);
  const status = selected <= 1 ? "No propagating visible output." : "Visible channel open.";
  reading.textContent = `${status} Visible pair: ${(100 * fraction).toFixed(2)}%. Dark pair: ${(100 * (1 - fraction)).toFixed(2)}% of outgoing flux.`;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.scale(scale, scale);
  const x = value => 45 + (width - 63) * value / maxEnergy;
  const y = prob => 15 + (height - 45) * (1 - prob);
  const style = getComputedStyle(lab);
  ctx.font = "13px system-ui";
  ctx.fillStyle = style.color;
  ctx.strokeStyle = style.getPropertyValue("--rule");
  ctx.textAlign = "right";
  for (const prob of [0, 0.5, 1]) {
    ctx.fillText(`${100 * prob}%`, x(0) - 5, y(prob) + 4);
    ctx.beginPath();
    ctx.moveTo(x(0), y(prob));
    ctx.lineTo(x(maxEnergy), y(prob));
    ctx.stroke();
  }
  ctx.textAlign = "center";
  for (const tick of [0, 4, 8, 12, 16]) ctx.fillText(tick, x(tick), height - 6);
  ctx.strokeStyle = style.getPropertyValue("--link");
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 800; i++) {
    const value = maxEnergy * i / 800;
    if (i === 0) ctx.moveTo(x(value), y(0));
    else ctx.lineTo(x(value), y(at(value)));
  }
  ctx.stroke();
  ctx.fillStyle = style.color;
  ctx.beginPath();
  ctx.arc(x(selected), y(fraction), 4, 0, 2 * Math.PI);
  ctx.fill();
}

lab.hidden = false;
lab.addEventListener("input", draw);
new ResizeObserver(draw).observe(lab);
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);
draw();
