import type {
  Callbacks,
  Executor,
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
        setTimeout(() => {
          try {
            const x = onFulfilled!(this.value);
            resolvePromise(promise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      if (this.state === 'REJECTED') {
        setTimeout(() => {
          try {
            const x = onRejected!(this.reason);
            resolvePromise(promise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      if (this.state === 'PENDING') {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled!(this.value);
              resolvePromise(promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected!(this.reason);
              resolvePromise(promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });

    return promise;
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
