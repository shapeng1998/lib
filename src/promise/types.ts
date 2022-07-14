export interface MyPromiseLike<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | MyPromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: unknown) => TResult2 | MyPromiseLike<TResult2>)
      | undefined
      | null
  ): MyPromiseLike<TResult1 | TResult2>
}

export type State = 'PENDING' | 'FULFILLED' | 'REJECTED'
export type Resolve<T> = (value: T | MyPromiseLike<T>) => void
export type Reject = (reason?: unknown) => void
export type Executor<T> = (resolve: Resolve<T>, reject: Reject) => void
export type OnFulfilled<T, TResult1> =
  | ((value: T) => TResult1 | MyPromiseLike<TResult1>)
  | undefined
  | null
export type OnRejected<TResult2> =
  | ((reason: unknown) => TResult2 | MyPromiseLike<TResult2>)
  | undefined
  | null
export type OnFinally = () => void | undefined | null
export type Callbacks = (() => void)[]
