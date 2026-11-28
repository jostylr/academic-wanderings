// Two open radial channels, in units Delta = E_R = hbar^2/(2 mu R^2).
// Inputs are relative energy / E_R and the two dimensionless shell strengths.
export function visibleFlux(energy, barrier, mixing) {
  if (energy <= 1 || mixing === 0) return 0;
  const x = Math.sqrt(energy);
  const y = Math.sqrt(energy - 1);
  const a = Math.sin(x) / x;
  const b = Math.sin(y) / y;
  const realX = Math.cos(x) + barrier * a;
  const realY = Math.cos(y) + barrier * b;
  const sinX = Math.sin(x);
  const sinY = Math.sin(y);
  const real = realX * realY - sinX * sinY - mixing ** 2 * a * b;
  const imag = -(realX * sinY + realY * sinX);
  return 4 * x * y * (mixing * a * b) ** 2 / (real ** 2 + imag ** 2);
}
