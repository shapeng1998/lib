import { describe, expect, it } from 'vitest';
import { getRandomNumber } from '../utils';
import { quickSort, mergeSort } from './sort';

describe('Sorting algorithms', () => {
  const nums = Array.from({ length: 10 }, () => getRandomNumber(-100, 100));

  it('Quick sort', () => {
    expect(quickSort([...nums], (a, b) => a - b)).toEqual(
      [...nums].sort((a, b) => a - b)
    );
    expect(quickSort([...nums], (a, b) => b - a)).toEqual(
      [...nums].sort((a, b) => b - a)
    );
  });

  it('Merge sort', () => {
    expect(mergeSort([...nums], (a, b) => a - b)).toEqual(
      [...nums].sort((a, b) => a - b)
    );
    expect(mergeSort([...nums], (a, b) => b - a)).toEqual(
      [...nums].sort((a, b) => b - a)
    );
  });
});
