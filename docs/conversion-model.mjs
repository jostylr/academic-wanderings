// The pulse lasts one time unit. Drive and detuning are angular frequencies.
export function population(time, drive, detuning) {
  const elapsed = Math.min(1, Math.max(0, time - 1));
  const frequency = Math.hypot(drive, detuning);
  if (frequency === 0) return 0;
  return ((drive / frequency) * Math.sin(frequency * elapsed / 2)) ** 2;
}

export function separation(time) {
  return 4 * Math.min(2, Math.max(0, time - 2));
}

export const logistic = x => 1 / (1 + Math.exp(-x));

export function pointerState(time, drive, detuning, quantile) {
  const b = population(time, drive, detuning);
  const shift = separation(time);
  const initial = Math.log(quantile / (1 - quantile));
  let low = initial - shift, high = initial + shift;
  for (let i = 0; i < 48; i++) {
    const middle = (low + high) / 2;
    const cumulative = (1 - b) * logistic(middle + shift) + b * logistic(middle - shift);
    if (cumulative < quantile) low = middle;
    else high = middle;
  }
  const position = (low + high) / 2;
  const density = x => logistic(x) * logistic(-x);
  const localB = b * density(position - shift);
  const localA = (1 - b) * density(position + shift);
  return { b, position, localWeight: localB / (localA + localB) };
}
