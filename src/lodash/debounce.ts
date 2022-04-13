import type { DebouncedFunc } from './types'

export function debounce<T extends(...args: any) => any>(
  this: any,
  func: T,
  wait = 0,
): DebouncedFunc<T> {
  let timeout: number
  let res: ReturnType<T>

  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      res = func.apply(this, args)
    }, wait)

    return res
  }
}
