import { describe, expect, it } from 'vitest';
import MyPromise from '../promise';

const mySleepResolve = (ms: number, value: any) => {
  return new MyPromise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, ms);
  });
};

const mySleepReject = (ms: number, reason: any) => {
  return new MyPromise((_resolve, reject) => {
    setTimeout(() => {
      reject(reason);
    }, ms);
  });
};

describe('Promise ESNext test suite', () => {
  it('Promise.all should work', async () => {
    const promises = [
      mySleepResolve(10, 1),
      mySleepResolve(20, 2),
      mySleepResolve(30, 3),
    ];

    await expect(MyPromise.all(promises)).resolves.toEqual([1, 2, 3]);

    await expect(
      MyPromise.all([...promises, mySleepReject(10, 'error')])
    ).rejects.toEqual('error');
  });

  it('Promise.allSettled should work', async () => {
    const promises = [
      mySleepResolve(10, 1),
      mySleepReject(20, 2),
      mySleepResolve(30, 3),
    ];

    expect(await MyPromise.allSettled(promises)).toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'rejected', reason: 2 },
      { status: 'fulfilled', value: 3 },
    ]);
  });

  it('Promise.any should work', async () => {
    const promises = [
      mySleepResolve(10, 1),
      mySleepReject(20, 2),
      mySleepResolve(30, 3),
    ];

    await expect(MyPromise.any(promises)).resolves.toEqual(1);

    try {
      await MyPromise.any([...promises, MyPromise.reject(2)]);
    } catch (e) {
      expect(e).toBeInstanceOf(AggregateError);
      expect((e as AggregateError).errors).toEqual([1, 2]);
    }
  });

  it('Promise.race should work', async () => {
    let promises = [
      mySleepResolve(10, 1),
      mySleepReject(20, 2),
      mySleepResolve(30, 3),
    ];

    await expect(MyPromise.race(promises)).resolves.toEqual(1);

    promises = [
      mySleepReject(10, 1),
      mySleepResolve(20, 2),
      mySleepReject(30, 3),
    ];

    await expect(MyPromise.race(promises)).rejects.toEqual(1);
  });
});
