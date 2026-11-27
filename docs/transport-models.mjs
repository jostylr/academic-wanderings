// Two-dimensional column-vector conventions, matching the companion Reviews.
export const det2 = matrix => matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

export function multiply2(left, right) {
  return left.map(row => right[0].map((_, column) =>
    row[0] * right[0][column] + row[1] * right[1][column]));
}

function sinhc(value) {
  if (Math.abs(value) < 1e-4) {
    const square = value * value;
    return 1 + square / 6 + square * square / 120 + square ** 3 / 5040;
  }
  return Math.sinh(value) / value;
}

export function flowMatrix({ d, s, k, t }) {
  return [
    [Math.exp((d + s) * t), k * Math.exp(d * t) * t * sinhc(s * t)],
    [0, Math.exp((d - s) * t)],
  ];
}

export function flowState(parameters) {
  const { d, t } = parameters;
  const matrix = flowMatrix(parameters);
  const half = flowMatrix({ ...parameters, t: t / 2 });
  const jacobian = det2(matrix);
  const density = 1 / jacobian;
  return {
    matrix, jacobian, density,
    divergence: 2 * d,
    predictedJacobian: Math.exp(2 * d * t),
    mass: jacobian * density,
    halfJacobianProduct: det2(half) ** 2,
    composedHalfSteps: multiply2(half, half),
  };
}

export function focusState(t) {
  const jacobian = 1 - t;
  const length = Math.abs(jacobian);
  const singular = jacobian === 0;
  return {
    jacobian, length, singular,
    densityRatio: singular ? null : 1 / length,
    velocityGradient: singular ? null : -1 / jacobian,
    actionCoefficient: singular ? null : -1 / (2 * jacobian),
    stage: singular ? "at" : t < 1 ? "before" : "after",
  };
}
