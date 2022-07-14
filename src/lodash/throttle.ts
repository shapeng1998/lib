import type { DebouncedFunc } from './types'

export function throttle<T extends (...args: any) => any>(
  this: any,
  func: T,
  wait = 0
): DebouncedFunc<T> {
  let inThrottle = false
  let res: ReturnType<T>

  return (...args) => {
    if (!inThrottle) {
      res = func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), wait)
    }
    return res
  }
}
