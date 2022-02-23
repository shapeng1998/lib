import { DebouncedFunc } from './types';

export function debounce<T extends (...args: any) => any>(
  func: T,
  wait: number = 0
): DebouncedFunc<T> {
  let timeout: number;
  let res: ReturnType<T>;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      res = func.apply(undefined, args);
    }, wait);

    return res;
  };
}
