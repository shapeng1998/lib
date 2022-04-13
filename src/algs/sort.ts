import type { CompareFn } from './types'

type SortFunction = <T>(arr: T[], compare: CompareFn<T>) => T[]

export const quickSort: SortFunction = (arr, compare) => {
  function sort(l: number, r: number) {
    if (l >= r)
      return

    let i = l - 1
    let j = r + 1
    const x = arr[(i + j) >>> 1]

    while (i < j) {
      do i++
      while (compare(arr[i], x) < 0)
      do j--
      while (compare(arr[j], x) > 0)
      if (i < j)
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }

    sort(l, j)
    sort(j + 1, r)
  }

  sort(0, arr.length - 1)

  return arr
}

export const mergeSort: SortFunction = (arr, compare) => {
  function sort(l: number, r: number) {
    if (l >= r)
      return

    const mid = (l + r) >>> 1
    sort(l, mid)
    sort(mid + 1, r)

    const tmp = new Array(r - l + 1)

    let k = 0
    let i = l
    let j = mid + 1

    while (i <= mid && j <= r) {
      if (compare(arr[i], arr[j]) <= 0)
        tmp[k++] = arr[i++]
      else tmp[k++] = arr[j++]
    }
    while (i <= mid) tmp[k++] = arr[i++]
    while (j <= r) tmp[k++] = arr[j++]

    for (let i = l, j = 0; i <= r; i++, j++) arr[i] = tmp[j]
  }

  sort(0, arr.length - 1)

  return arr
}
