import type { SpecValue } from '../types';

/**
 * Returns true when at least one value in the array differs from the others.
 * Returns false for empty arrays and single-element arrays.
 */
export function isDifferent(values: (SpecValue | null | undefined)[]): boolean {
  const defined = values.filter(
    (v): v is SpecValue => v !== null && v !== undefined,
  );
  if (defined.length <= 1) return false;
  return defined.some((v) => v !== defined[0]);
}

/**
 * Returns the index of the "best" numeric value in the array.
 * When higherIsBetter is true, returns the index of the highest value.
 * When higherIsBetter is false, returns the index of the lowest value.
 * Returns -1 for empty arrays, non-numeric values, or when all values are equal.
 */
export function getBetterIndex(
  values: (SpecValue | null | undefined)[],
  higherIsBetter: boolean,
): number {
  const numericEntries: { index: number; value: number }[] = [];

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (typeof v === 'number' && !Number.isNaN(v)) {
      numericEntries.push({ index: i, value: v });
    }
  }

  if (numericEntries.length <= 1) return -1;

  const allSame = numericEntries.every(
    (e) => e.value === numericEntries[0]!.value,
  );
  if (allSame) return -1;

  const best = numericEntries.reduce((acc, entry) =>
    higherIsBetter
      ? entry.value > acc.value
        ? entry
        : acc
      : entry.value < acc.value
        ? entry
        : acc,
  );

  return best.index;
}

/**
 * Returns the index of the "worst" numeric value in the array.
 * When higherIsBetter is true, returns the index of the lowest value.
 * When higherIsBetter is false, returns the index of the highest value.
 * Returns -1 for empty arrays, non-numeric values, or when all values are equal.
 */
export function getWorstIndex(
  values: (SpecValue | null | undefined)[],
  higherIsBetter: boolean,
): number {
  const numericEntries: { index: number; value: number }[] = [];

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (typeof v === 'number' && !Number.isNaN(v)) {
      numericEntries.push({ index: i, value: v });
    }
  }

  if (numericEntries.length <= 1) return -1;

  const allSame = numericEntries.every(
    (e) => e.value === numericEntries[0]!.value,
  );
  if (allSame) return -1;

  const worst = numericEntries.reduce((acc, entry) =>
    higherIsBetter
      ? entry.value < acc.value
        ? entry
        : acc
      : entry.value > acc.value
        ? entry
        : acc,
  );

  return worst.index;
}
