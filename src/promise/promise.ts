import type {
  Callbacks,
  Executor,
  MyPromiseLike,
  OnFinally,
  OnFulfilled,
  OnRejected,
  Reject,
  Resolve,
  State,
} from './types'

class MyPromise<T = unknown> {
  #state: State = 'PENDING'
  #value: T = undefined as unknown as T
  #reason: unknown = undefined

  #onFulfilledCallbacks: Callbacks = []
  #onRejectedCallbacks: Callbacks = []

  constructor(executor: Executor<T>) {
    const resolve: Resolve<T> = (value) => {
      if (this.#state === 'PENDING') {
        this.#state = 'FULFILLED'
        this.#value = value as T
        this.#onFulfilledCallbacks.forEach((cb) => cb())
      }
    }

    const reject: Reject = (reason) => {
      if (this.#state === 'PENDING') {
        this.#state = 'REJECTED'
        this.#reason = reason
        this.#onRejectedCallbacks.forEach((cb) => cb())
      }
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: OnFulfilled<T, TResult1>,
    onrejected?: OnRejected<TResult2>
  ): MyPromise<TResult1 | TResult2> {
    onfulfilled =
      typeof onfulfilled === 'function'
        ? onfulfilled
        : (value: T | TResult1) => value as TResult1
    onrejected =
      typeof onrejected === 'function'
        ? onrejected
        : (reason) => {
            throw reason
          }

    const promise = new MyPromise<TResult1 | TResult2>((resolve, reject) => {
      if (this.#state === 'FULFILLED') {
        queueMicrotask(() => {
          try {
            const x = onfulfilled!(this.#value)
            resolvePromise(promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.#state === 'REJECTED') {
        queueMicrotask(() => {
          try {
            const x = onrejected!(this.#reason)
            resolvePromise(promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.#state === 'PENDING') {
        this.#onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onfulfilled!(this.#value)
              resolvePromise(promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.#onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onrejected!(this.#reason)
              resolvePromise(promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })

    return promise
  }

  catch<TResult = never>(
    onRejected?: OnRejected<TResult>
  ): MyPromise<T | TResult> {
    return this.then(undefined, onRejected)
  }

  finally(onfinally?: OnFinally): MyPromise<T> {
    if (typeof onfinally !== 'function') return this.then(onfinally, onfinally)

    return this.then(
      (value) => {
        return MyPromise.resolve(onfinally()).then(() => value)
      },
      (reason) => {
        return MyPromise.resolve(onfinally()).then(() => {
          throw reason
        })
      }
    )
  }

  static resolve(): MyPromise<void>
  static resolve<T>(value: T | MyPromiseLike<T>): MyPromise<T>
  static resolve<T>(value?: T | MyPromiseLike<T>): MyPromise<T> {
    if (value instanceof MyPromise) return value

    return new MyPromise((resolve) => {
      resolve(value!)
    })
  }

  static reject<T = never>(reason?: unknown): MyPromise<T> {
    return new MyPromise((_resolve, reject) => {
      reject(reason)
    })
  }

  static all<T>(
    values: Iterable<T | MyPromiseLike<T>>
  ): MyPromise<Awaited<T>[]> {
    return new MyPromise((resolve, reject) => {
      try {
        const results: Awaited<T>[] = []

        let idx = 0
        let cnt = 0
        for (const value of values) {
          const i = idx++
          MyPromise.resolve(value).then((value) => {
            results[i] = value as Awaited<T>
            cnt++

            if (cnt === idx) resolve(results)
          }, reject)
        }

        if (cnt === idx) resolve(results)
      } catch (e) {
        reject(e)
      }
    })
  }

  static allSettled<T>(
    values: Iterable<T | MyPromiseLike<T>>
  ): MyPromise<PromiseSettledResult<Awaited<T>>[]> {
    return new MyPromise((resolve, reject) => {
      try {
        const results: PromiseSettledResult<Awaited<T>>[] = []

        let idx = 0
        let cnt = 0
        for (const value of values) {
          const i = idx++
          MyPromise.resolve(value).then(
            (value) => {
              results[i] = { status: 'fulfilled', value: value as Awaited<T> }
              cnt++

              if (cnt === idx) resolve(results)
            },
            (reason) => {
              results[i] = { status: 'rejected', reason }
              cnt++

              if (cnt === idx) resolve(results)
            }
          )
        }

        if (cnt === idx) resolve(results)
      } catch (e) {
        reject(e)
      }
    })
  }

  static any<T>(values: Iterable<T | MyPromiseLike<T>>): MyPromise<Awaited<T>> {
    return new MyPromise((resolve, reject) => {
      try {
        const errors: T[] = []

        let idx = 0
        let cnt = 0
        for (const value of values) {
          const i = idx++
          MyPromise.resolve(value).then(
            (value) => {
              resolve(value as Awaited<T>)
            },
            (reason) => {
              errors[i] = reason
              cnt++

              if (cnt === idx) {
                reject(new AggregateError(errors, 'All promises were rejected'))
              }
            }
          )
        }

        if (cnt === idx)
          reject(new AggregateError(errors, 'All promises were rejected'))
      } catch (e) {
        reject(e)
      }
    })
  }

  static race<T>(
    values: Iterable<T | MyPromiseLike<T>>
  ): MyPromise<Awaited<T>> {
    return new MyPromise((resolve, reject) => {
      try {
        for (const value of values) {
          MyPromise.resolve(value).then((value) => {
            resolve(value as Awaited<T>)
          }, reject)
        }
      } catch (e) {
        reject(e)
      }
    })
  }
}

function resolvePromise<T>(
  promise: MyPromise<T>,
  x: T | MyPromiseLike<T>,
  resolve: Resolve<T>,
  reject: Reject
) {
  if (promise === x) {
    return reject(TypeError('Chaining cycle detected for promise #<MyPromise>'))
  }

  let called = false
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      const then = (x as MyPromiseLike<T>).then
      if (typeof then === 'function') {
        then.call(
          x,
          (value) => {
            if (called) return
            called = true
            resolvePromise(promise, value, resolve, reject)
          },
          (reason) => {
            if (called) return
            called = true
            reject(reason)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

// @ts-expect-error only for testing
MyPromise.deferred = function () {
  const res = {} as any
  res.promise = new MyPromise((resolve, reject) => {
    res.resolve = resolve
    res.reject = reject
  })
  return res
}

export = MyPromise
