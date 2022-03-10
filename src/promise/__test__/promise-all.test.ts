import { describe, expect, it, vi } from 'vitest';
import MyPromise from '../promise';

vi.useFakeTimers();

describe('Promise.all test suite', () => {
  it('basic Promise.all example', () => {
    let promiseList = [
      MyPromise.resolve(1),
      MyPromise.resolve(2),
      MyPromise.resolve(3),
      4,
    ];

    let results;
    MyPromise.all(promiseList).then((value) => {
      results = value;
    });

    vi.advanceTimersByTime(0);

    expect(results).toEqual([1, 2, 3, 4]);

    let error;
    MyPromise.all([promiseList, MyPromise.reject(5)]).then(
      (value) => {
        results = value;
      },
      (reason) => {
        error = reason;
      }
    );

    vi.advanceTimersByTime(0);

    expect(error).toEqual(5);
  });
});
