const tau = 2 * Math.PI;
const timesI = ([real, imaginary], coefficient) => [-coefficient * imaginary, coefficient * real];
const norm2 = ([real, imaginary]) => real * real + imaginary * imaginary;
const innerImaginary = ([real, imaginary], [dReal, dImaginary]) => real * dImaginary - imaginary * dReal;
export const wrapAngle = angle => ((angle % tau) + tau) % tau;

// Free scalar circle modes, with ℏ = M = 1 and measure R dθ.
export function circleWave(theta, { alpha, n, radius, time = 0 }) {
  const waveNumber = n + alpha;
  const energy = waveNumber ** 2 / (2 * radius ** 2);
  const amplitude = 1 / Math.sqrt(tau * radius);
  const coverPhase = waveNumber * theta - energy * time;
  const periodicPhase = n * theta - energy * time;
  const cover = [amplitude * Math.cos(coverPhase), amplitude * Math.sin(coverPhase)];
  const periodic = [amplitude * Math.cos(periodicPhase), amplitude * Math.sin(periodicPhase)];
  return {
    cover, periodic, energy,
    coverDerivative: timesI(cover, waveNumber),
    covariantDerivative: timesI(periodic, waveNumber),
  };
}

export function circleState({ alpha, n, radius, time, seamDegrees = 0 }) {
  const angularVelocity = (n + alpha) / radius ** 2;
  const angle = angularVelocity * time;
  const wave = circleWave(angle, { alpha, n, radius, time });
  const density = norm2(wave.cover);
  const coverVelocity = innerImaginary(wave.cover, wave.coverDerivative) / (radius ** 2 * density);
  const connectionVelocity = innerImaginary(wave.periodic, wave.covariantDerivative) / (radius ** 2 * norm2(wave.periodic));
  const twistAngle = tau * alpha;
  return {
    energy: wave.energy, density, coverVelocity, connectionVelocity,
    arcSpeed: radius * coverVelocity,
    probability: tau * radius * density,
    twist: [Math.cos(twistAngle), Math.sin(twistAngle)],
    holonomy: [Math.cos(twistAngle), -Math.sin(twistAngle)],
    angle: wrapAngle(angle),
    seamAngle: wrapAngle(angle - seamDegrees * Math.PI / 180),
    point: [Math.cos(angle), Math.sin(angle)],
  };
}
