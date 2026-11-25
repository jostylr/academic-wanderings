const latitude = document.getElementById("latitude");
const longitudeStep = document.getElementById("longitude-step");

function updateLatitude() {
  const phi = Number(latitude.value) * Math.PI / 180;
  const t = Number(longitudeStep.value);
  const h = Math.cos(phi);
  const s = Math.sin(phi);
  const halfSine = Math.sin(t / 2);
  // The half-angle form avoids subtracting two nearly equal cosines.
  const theta = 2 * Math.asin(h * halfSine);
  const north = (theta / Math.sin(theta)) * h * s * 2 * halfSine ** 2;
  const quadratic = h * s * t ** 2 / 2;
  const covariant = quadratic - h * s ** 3 * t ** 4 / 24;
  const taylor = quadratic + h * s * (2 * h ** 2 - 1) * t ** 4 / 24;

  document.getElementById("latitude-value").value = latitude.value + "°";
  document.getElementById("step-value").value = t.toFixed(2) + " rad";
  document.getElementById("north-exact").textContent = north.toFixed(9);
  document.getElementById("north-taylor").textContent = taylor.toFixed(9);
  document.getElementById("north-covariant").textContent = covariant.toFixed(9);
  document.getElementById("north-limit").textContent = (h ** 3 * s).toFixed(6);
  document.getElementById("north-measured").textContent = (24 * (north - covariant) / t ** 4).toFixed(6);
}

latitude.addEventListener("input", updateLatitude);
longitudeStep.addEventListener("input", updateLatitude);
updateLatitude();
document.getElementById("latitude-lab").hidden = false;
