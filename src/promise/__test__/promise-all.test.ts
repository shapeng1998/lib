import { describe, expect, it } from 'vitest';
import MyPromise from '../promise';

describe('Promise.all test suite', () => {
  it('basic Promise.all example', async () => {
    const promiseList = [
      MyPromise.resolve(1),
      MyPromise.resolve(2),
      MyPromise.resolve(3),
      4,
    ];

    const result = await MyPromise.all(promiseList);
    expect(result).toEqual([1, 2, 3, 4]);

    try {
      await MyPromise.all([...promiseList, MyPromise.reject(5)]);
    } catch (e) {
      expect(e).toEqual(5);
    }
  });
});
