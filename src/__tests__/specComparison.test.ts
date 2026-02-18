import { describe, it, expect } from 'vitest';
import { isDifferent, getBetterIndex, getWorstIndex } from '../utils/comparison';

describe('isDifferent', () => {
  it('should return true when values differ', () => {
    expect(isDifferent([8, 12, 16])).toBe(true);
  });

  it('should return false when all values are the same', () => {
    expect(isDifferent([120, 120, 120])).toBe(false);
  });

  it('should return false for a single value', () => {
    expect(isDifferent([42])).toBe(false);
  });

  it('should return false for an empty array', () => {
    expect(isDifferent([])).toBe(false);
  });

  it('should return true for two different values', () => {
    expect(isDifferent([100, 200])).toBe(true);
  });

  it('should return true for differing string values', () => {
    expect(isDifferent(['A17 Pro', 'Snapdragon 8 Gen 3'])).toBe(true);
  });

  it('should return false for identical string values', () => {
    expect(isDifferent(['IP68', 'IP68', 'IP68'])).toBe(false);
  });

  it('should return true for differing boolean values', () => {
    expect(isDifferent([true, false, true])).toBe(true);
  });

  it('should return false for identical boolean values', () => {
    expect(isDifferent([true, true])).toBe(false);
  });

  it('should handle null and undefined values gracefully', () => {
    expect(isDifferent([null, undefined])).toBe(false);
    expect(isDifferent([null, 5])).toBe(false); // only one defined value
    expect(isDifferent([null, 5, 10])).toBe(true);
    expect(isDifferent([undefined, undefined, 42])).toBe(false);
  });

  it('should handle three products with mixed null', () => {
    expect(isDifferent([100, null, 200])).toBe(true);
  });
});

describe('getBetterIndex', () => {
  describe('when higherIsBetter is true', () => {
    it('should return the index of the highest value', () => {
      expect(getBetterIndex([8, 12, 16], true)).toBe(2);
    });

    it('should return the index of the highest among two products', () => {
      expect(getBetterIndex([4441, 5000], true)).toBe(1);
    });

    it('should return first occurrence when multiple are highest', () => {
      expect(getBetterIndex([5000, 3000, 5000], true)).toBe(0);
    });
  });

  describe('when higherIsBetter is false', () => {
    it('should return the index of the lowest value', () => {
      expect(getBetterIndex([232, 221, 213], false)).toBe(2);
    });

    it('should return the index of the lowest among two products', () => {
      expect(getBetterIndex([232, 201], false)).toBe(1);
    });
  });

  it('should return -1 when all values are equal', () => {
    expect(getBetterIndex([120, 120, 120], true)).toBe(-1);
  });

  it('should return -1 for an empty array', () => {
    expect(getBetterIndex([], true)).toBe(-1);
  });

  it('should return -1 for a single value', () => {
    expect(getBetterIndex([42], true)).toBe(-1);
  });

  it('should skip non-numeric values', () => {
    expect(getBetterIndex(['fast', 'faster'], true)).toBe(-1);
    expect(getBetterIndex([true, false], true)).toBe(-1);
  });

  it('should handle null and undefined values', () => {
    expect(getBetterIndex([null, 10, 20], true)).toBe(2);
    expect(getBetterIndex([undefined, undefined], true)).toBe(-1);
  });
});

describe('getWorstIndex', () => {
  describe('when higherIsBetter is true', () => {
    it('should return the index of the lowest value', () => {
      expect(getWorstIndex([8, 12, 16], true)).toBe(0);
    });

    it('should return the index of the lowest among two products', () => {
      expect(getWorstIndex([5000, 4441], true)).toBe(1);
    });
  });

  describe('when higherIsBetter is false', () => {
    it('should return the index of the highest value (heaviest is worst)', () => {
      expect(getWorstIndex([232, 221, 213], false)).toBe(0);
    });
  });

  it('should return -1 when all values are equal', () => {
    expect(getWorstIndex([120, 120, 120], true)).toBe(-1);
  });

  it('should return -1 for an empty array', () => {
    expect(getWorstIndex([], false)).toBe(-1);
  });

  it('should return -1 for a single value', () => {
    expect(getWorstIndex([42], false)).toBe(-1);
  });

  it('should skip non-numeric values', () => {
    expect(getWorstIndex(['a', 'b', 'c'], true)).toBe(-1);
  });

  it('should handle null and undefined values', () => {
    expect(getWorstIndex([null, 10, 20], true)).toBe(1);
    expect(getWorstIndex([null, null], false)).toBe(-1);
  });
});
