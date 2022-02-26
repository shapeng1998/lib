import { DebouncedFunc } from './types';

export function debounce<T extends (...args: any) => any>(
  this: any,
  func: T,
  wait: number = 0
): DebouncedFunc<T> {
  const thisArg = this;

  let timeout: number;
  let res: ReturnType<T>;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      res = func.apply(thisArg, args);
    }, wait);

    return res;
  };
}
