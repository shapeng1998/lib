import { describe, expect, it } from 'vitest';
import { getRandomNumber } from '../utils';
import { quickSort } from './sort';

describe('Sorting algorithms', () => {
  it('Sort an integer array', () => {
    const nums = Array.from({ length: 10 }, () => getRandomNumber(0, 100));
    expect(quickSort(nums, (a, b) => a - b)).toEqual(
      nums.sort((a, b) => a - b)
    );
  });
});
