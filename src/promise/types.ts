export interface MyPromiseLike<T> {
  then<TResult1 = T, TResult2 = never>(
    onFulfilled?:
      | ((value: T) => TResult1 | MyPromiseLike<TResult1>)
      | undefined
      | null,
    onRejected?:
      | ((reason: any) => TResult2 | MyPromiseLike<TResult2>)
      | undefined
      | null
  ): MyPromiseLike<TResult1 | TResult2>;
}

export type State = 'PENDING' | 'FULFILLED' | 'REJECTED';
export type Resolve<T> = (value: T | MyPromiseLike<T>) => void;
export type Reject = (reason?: any) => void;
export type Executor<T> = (resolve: Resolve<T>, reject: Reject) => void;
export type OnFulfilled<T, TResult1> =
  | ((value: T) => TResult1 | MyPromiseLike<TResult1>)
  | undefined
  | null;
export type OnRejected<TResult2> =
  | ((reason: any) => TResult2 | MyPromiseLike<TResult2>)
  | undefined
  | null;
export type Callbacks = (() => void)[];
