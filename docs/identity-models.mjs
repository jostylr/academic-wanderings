// Exact two-dimensional free Gaussian waves; units ℏ = 1.
export function packetAt(point, time, { mass, velocity, width }) {
  const tau = time / (2 * mass * width ** 2);
  const variance = width ** 2 * (1 + tau ** 2);
  const offset = point.map((x, i) => x - velocity[i] * time);
  const radius2 = offset.reduce((sum, x) => sum + x * x, 0);
  const logDensity = -Math.log(2 * Math.PI * variance) - radius2 / (2 * variance);
  const phase = mass * (velocity.reduce((sum, u, i) => sum + u * point[i], 0)
    - velocity.reduce((sum, u) => sum + u * u, 0) * time / 2)
    + tau * radius2 / (4 * variance) - Math.atan(tau);
  const amplitude = Math.exp(logDensity / 2);
  return {
    logDensity, variance,
    wave: [amplitude * Math.cos(phase), amplitude * Math.sin(phase)],
    velocity: velocity.map((u, i) => u + time * offset[i] / (4 * mass ** 2 * width ** 4 + time ** 2)),
  };
}

export function speciesPackets({ width = 0.7, speed = 2, massRatio = 4 } = {}) {
  return [{ mass: 1, width, velocity: [speed, 0] },
    { mass: massRatio, width, velocity: [-speed, 0] }];
}

export function identityState(points, time, options = {}) {
  const [a, b] = speciesPackets(options);
  const a0 = packetAt(points[0], time, a), a1 = packetAt(points[1], time, a);
  const b0 = packetAt(points[0], time, b), b1 = packetAt(points[1], time, b);
  const logAB = a0.logDensity + b1.logDensity;
  const logBA = b0.logDensity + a1.logDensity;
  // Stable normalization keeps the guiding law usable in Gaussian tails.
  const peak = Math.max(logAB, logBA);
  const ab = Math.exp(logAB - peak), ba = Math.exp(logBA - peak);
  const weight = ab / (ab + ba);
  const reverseWeight = ba / (ab + ba);
  return {
    weight, reverseWeight, logDensity: peak + Math.log(ab + ba),
    velocities: [a0.velocity.map((u, i) => weight * u + reverseWeight * b0.velocity[i]),
      b1.velocity.map((u, i) => weight * u + reverseWeight * a1.velocity[i])],
    branchVelocities: [[a0.velocity, b1.velocity], [b0.velocity, a1.velocity]],
  };
}

export function traceIdentity({ displacement = 0.04, duration = 3, step = 0.005, ...options } = {}) {
  const frames = [];
  let points = [[displacement, -0.45], [0, 0.45]];
  const count = Math.ceil(duration / step), h = duration / count;
  const shifted = (q, v, factor) => q.map((p, j) => p.map((x, i) => x + factor * v[j][i]));
  for (let k = 0; k <= count; k++) {
    const time = k * h;
    const state = identityState(points, time, options);
    frames.push({ time, points: points.map(p => [...p]), ...state });
    if (k === count) break;
    const k1 = state.velocities;
    const k2 = identityState(shifted(points, k1, h / 2), time + h / 2, options).velocities;
    const k3 = identityState(shifted(points, k2, h / 2), time + h / 2, options).velocities;
    const k4 = identityState(shifted(points, k3, h), time + h, options).velocities;
    points = points.map((p, j) => p.map((x, i) => x + h * (k1[j][i] + 2 * k2[j][i] + 2 * k3[j][i] + k4[j][i]) / 6));
  }
  return frames;
}
