const tubeAngle = document.getElementById("tube-angle");
const canvas = document.getElementById("torus-view");
const context = canvas.getContext("2d");
const tilt = 0.64;

function project(u, w) {
  const radius = 2 + Math.cos(w);
  const x = radius * Math.cos(u);
  const y = radius * Math.sin(u);
  const z = Math.sin(w);
  return {
    x: canvas.width / 2 + 108 * x,
    y: canvas.height / 2 - 98 * (z * Math.cos(tilt) - y * Math.sin(tilt)),
    depth: y * Math.cos(tilt) + z * Math.sin(tilt)
  };
}

function drawTorus(selected) {
  // Include the selected parallel among the mesh edges so the far side
  // of its stroke is hidden by the same faces as the underlying surface.
  const tau = 2 * Math.PI;
  const mesh = Array.from({length: 41}, (_, i) => tau * i / 40);
  if (!mesh.some(w => Math.abs(w - selected) < 1e-10)) mesh.push(selected);
  mesh.sort((a, b) => a - b);
  const faces = [];
  for (let j = 1; j < mesh.length; j++) {
    const low = mesh[j - 1];
    const high = mesh[j];
    const w = (low + high) / 2;
    for (let i = 0; i < 72; i++) {
      const left = tau * i / 72;
      const right = tau * (i + 1) / 72;
      const u = (left + right) / 2;
      const points = [project(left, low), project(right, low), project(right, high), project(left, high)];
      const light = 0.5 * Math.sin(w) - 0.35 * Math.cos(u) * Math.cos(w);
      const hue = 197 + 24 * Math.cos(w);
      faces.push({
        points, depth: project(u, w).depth,
        color: "hsl(" + hue + " 32% " + (61 + 19 * light) + "%)",
        lowerEdge: Math.abs(low - selected) < 1e-10,
        upperEdge: Math.abs(high - selected) < 1e-10 || (selected === 0 && high === tau)
      });
    }
  }
  faces.sort((a, b) => a.depth - b.depth);
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (const face of faces) {
    const [p, q, r, s] = face.points;
    context.beginPath();
    context.moveTo(p.x, p.y);
    for (const point of [q, r, s]) context.lineTo(point.x, point.y);
    context.closePath();
    context.fillStyle = context.strokeStyle = face.color;
    context.lineWidth = 0.8;
    context.fill();
    context.stroke();
    if (face.lowerEdge || face.upperEdge) {
      const [start, end] = face.lowerEdge ? [p, q] : [r, s];
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.lineWidth = 5;
      context.strokeStyle = "#642f0c";
      context.stroke();
      context.lineWidth = 2.5;
      context.strokeStyle = "#ffcb69";
      context.stroke();
    }
  }
}

function updateTorus() {
  const w = Number(tubeAngle.value) * Math.PI / 180;
  const radius = 2 + Math.cos(w);
  const curvature = Math.cos(w) / radius;
  const acceleration = radius * Math.sin(w);
  const difference = -curvature * radius ** 2 * acceleration;
  const format = value => (Math.abs(value) < 1e-12 ? 0 : value).toFixed(5);
  document.getElementById("angle-value").value = tubeAngle.value + "°";
  document.getElementById("gaussian").textContent = format(curvature);
  document.getElementById("sideways").textContent = format(acceleration);
  document.getElementById("quartic").textContent = format(difference);
  if (context) drawTorus(w);
}

tubeAngle.addEventListener("input", updateTorus);
updateTorus();
document.getElementById("torus-lab").hidden = false;
