// Pure calculations shared by the two experiments and their independent checks.
const radians = degrees => degrees * Math.PI / 180;
const probability = value => Math.max(0, Math.min(1, value));

export function spinState(rotationDegrees, analyzerDegrees) {
  const alpha = radians(rotationDegrees);
  const theta = radians(analyzerDegrees);
  const a = Math.cos(alpha / 2);
  const b = Math.sin(alpha / 2);
  const plus = probability(Math.cos((alpha - theta) / 2) ** 2);
  return {
    a, b, plus, minus: 1 - plus,
    bright: probability((1 + a) / 2),
    spin: { x: Math.sin(alpha), z: Math.cos(alpha) },
    analyzer: { x: Math.sin(theta), z: Math.cos(theta) },
  };
}

export function diracState(momentum, phaseDegrees) {
  const energy = Math.hypot(1, momentum);
  const ratio = momentum / (energy + 1);
  const a = 1 / Math.hypot(1, ratio);
  const b = ratio * a;
  const phase = radians(phaseDegrees);
  const bReal = b * Math.cos(phase);
  const bImaginary = b * Math.sin(phase);
  // |u_+† χ|²: the reference eigenspinor is (a, 0, b, 0).
  const overlapReal = a * a + b * b * Math.cos(phase);
  const overlapImaginary = b * b * Math.sin(phase);
  return {
    a, b, bReal, bImaginary, energy,
    density: a * a + bReal * bReal + bImaginary * bImaginary,
    velocity: 2 * a * bReal,
    referenceVelocity: momentum / energy,
    positiveWeight: probability(overlapReal ** 2 + overlapImaginary ** 2),
  };
}
