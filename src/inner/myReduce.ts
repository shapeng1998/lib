export function myReduce<T = unknown, U = unknown>(
  arr: T[],
  callbackfn: (
    previousValue: U,
    currentValue: T,
    currentIndex: number,
    array: T[]
  ) => U,
  initialValue?: U
): U {
  let i = initialValue !== undefined ? 0 : 1
  let acc: U = initialValue ?? (arr[0] as unknown as U)

  for (; i < arr.length; i++) acc = callbackfn(acc, arr[i], i, arr)

  return acc
}
