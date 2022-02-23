import { DebouncedFunc } from './types';

export function throttle<T extends (...args: any) => any>(
  func: T,
  wait: number = 0
): DebouncedFunc<T> {
  let inThrottle = false;
  let res: ReturnType<T>;

  return function (...args) {
    if (!inThrottle) {
      res = func.apply(undefined, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
    return res;
  };
}
