const experiment = document.querySelector("#oscillator-plot");
const positionInput = experiment.querySelector("#initial-position");
const positionValue = experiment.querySelector("#position-value");
const canvas = experiment.querySelector("canvas");
const context = canvas.getContext("2d");

function drawTrajectories() {
  const start = positionInput.valueAsNumber;
  const width = canvas.clientWidth;
  const height = 250;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.style.height = height + "px";
  context.setTransform(scale, 0, 0, scale, 0, 0);

  const style = getComputedStyle(experiment);
  const ink = style.getPropertyValue("--ink");
  const link = style.getPropertyValue("--link");
  const left = 36;
  const right = width - 23;
  const top = 22;
  const bottom = height - 32;
  const x = t => left + t / (2 * Math.PI) * (right - left);
  const y = position => bottom - (position + 3) / 6 * (bottom - top);

  context.font = "13px system-ui";
  context.fillStyle = ink;
  context.strokeStyle = style.getPropertyValue("--rule");
  context.lineWidth = 1;
  context.textAlign = "right";
  for (const position of [-3, -2, -1, 0, 1, 2, 3]) {
    context.fillText(String(position), left - 8, y(position) + 4);
    context.beginPath();
    context.moveTo(left, y(position));
    context.lineTo(right, y(position));
    context.stroke();
  }
  context.textAlign = "center";
  for (const [time, label] of [[0, "0"], [Math.PI, "π"], [2 * Math.PI, "2π"]]) {
    context.fillText(label, x(time), bottom + 18);
  }
  context.textAlign = "left";
  context.fillText("Position", left, top - 7);
  context.textAlign = "right";
  context.fillText("Time", right, height - 1);

  function plot(positionAt, color, dash) {
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.setLineDash(dash);
    context.beginPath();
    for (let i = 0; i <= 240; i++) {
      const t = 2 * Math.PI * i / 240;
      if (i === 0) context.moveTo(x(t), y(positionAt(t)));
      else context.lineTo(x(t), y(positionAt(t)));
    }
    context.stroke();
  }

  plot(t => start + Math.cos(t) - 1, link, []);
  plot(t => start * Math.cos(t), ink, [6, 5]);
  context.setLineDash([]);
  positionValue.value = start.toFixed(1);
  experiment.querySelector("#half-period").textContent =
    "At half a period the guided position is " + (start - 2).toFixed(1) +
    " and the classical position is " + (-start).toFixed(1) + ".";
}

if (context) {
  experiment.hidden = false;
  positionInput.addEventListener("input", drawTrajectories);
  window.addEventListener("resize", drawTrajectories);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", drawTrajectories);
  drawTrajectories();
}
