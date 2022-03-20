import type {
  Callbacks,
  Executor,
  MyAwaited,
  MyPromiseLike,
  OnFulfilled,
  OnRejected,
  Reject,
  Resolve,
  State,
} from './types';

class MyPromise<T> {
  private state: State;
  private value: T;
  private reason: any;

  private onFulfilledCallbacks: Callbacks;
  private onRejectedCallbacks: Callbacks;

  constructor(executor: Executor<T>) {
    this.state = 'PENDING';
    this.value = undefined as unknown as T;
    this.reason = undefined;

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve: Resolve<T> = (value) => {
      if (this.state === 'PENDING') {
        this.state = 'FULFILLED';
        this.value = value as T;
        this.onFulfilledCallbacks.forEach((cb) => cb());
      }
    };

    const reject: Reject = (reason) => {
      if (this.state === 'PENDING') {
        this.state = 'REJECTED';
        this.reason = reason;
        this.onRejectedCallbacks.forEach((cb) => cb());
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: OnFulfilled<T, TResult1>,
    onRejected?: OnRejected<TResult2>
  ): MyPromise<TResult1 | TResult2> {
    onFulfilled =
      typeof onFulfilled === 'function'
        ? onFulfilled
        : (value: T | TResult1) => value as TResult1;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise = new MyPromise<TResult1 | TResult2>((resolve, reject) => {
      if (this.state === 'FULFILLED') {
        queueMicrotask(() => {
          try {
            const x = onFulfilled!(this.value);
            resolvePromise(promise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      if (this.state === 'REJECTED') {
        queueMicrotask(() => {
          try {
            const x = onRejected!(this.reason);
            resolvePromise(promise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      if (this.state === 'PENDING') {
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onFulfilled!(this.value);
              resolvePromise(promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected!(this.reason);
              resolvePromise(promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });

    return promise;
  }

  static resolve(): MyPromise<void>;
  static resolve<T>(value: T | MyPromiseLike<T>): MyPromise<T>;
  static resolve<T>(value?: T | MyPromiseLike<T>): MyPromise<T> {
    if (value instanceof MyPromise) {
      return value;
    }

    return new MyPromise((resolve) => {
      resolve(value!);
    });
  }

  static reject<T = never>(reason?: any): MyPromise<T> {
    return new MyPromise((_resolve, reject) => {
      reject(reason);
    });
  }

  static all<T>(
    values: Iterable<T | MyPromiseLike<T>>
  ): MyPromise<MyAwaited<T>[]> {
    return new MyPromise((resolve, reject) => {
      try {
        const results: MyAwaited<T>[] = [];
        let idx = 0;
        let cnt = 0;

        for (const value of values) {
          const i = idx++;
          MyPromise.resolve(value).then((value) => {
            results[i] = value as MyAwaited<T>;
            cnt++;

            if (cnt === idx) {
              resolve(results);
            }
          }, reject);
        }

        if (cnt === idx) {
          resolve(results);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}

function resolvePromise<T>(
  promise: MyPromise<T>,
  x: T | MyPromiseLike<T>,
  resolve: Resolve<T>,
  reject: Reject
) {
  if (promise === x) {
    return reject(
      TypeError('Chaining cycle detected for promise #<MyPromise>')
    );
  }

  let called = false;
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      const then = (x as MyPromiseLike<T>).then;
      if (typeof then === 'function') {
        then.call(
          x,
          (value) => {
            if (called) return;
            called = true;
            resolvePromise(promise, value, resolve, reject);
          },
          (reason) => {
            if (called) return;
            called = true;
            reject(reason);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

// only for testing
// @ts-ignore
MyPromise.deferred = function () {
  const res = {} as any;
  res.promise = new MyPromise((resolve, reject) => {
    res.resolve = resolve;
    res.reject = reject;
  });
  return res;
};

export = MyPromise;
