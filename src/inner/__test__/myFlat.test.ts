import { describe, expect, it } from 'vitest';
import { myFlat } from '../myFlat';

describe('Array.prototype.flat inner function', () => {
  it('flat function should work', () => {
    const arr = [1, [2, [3, [4, [5]]]]];
    expect(myFlat(arr)).toEqual([1, 2, [3, [4, [5]]]]);
    expect(myFlat(arr, 2)).toEqual([1, 2, 3, [4, [5]]]);
    expect(myFlat(arr, 3)).toEqual([1, 2, 3, 4, [5]]);
    expect(myFlat(arr, 4)).toEqual([1, 2, 3, 4, 5]);
    expect(myFlat(arr, Infinity)).toEqual([1, 2, 3, 4, 5]);
  });
});
