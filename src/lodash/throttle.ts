export function throttle(func: Function, wait: number = 0) {
  let start = Date.now();
  return function (...args: any[]) {
    if (Date.now() - start >= wait) {
      start = Date.now();
      func(...args);
    }
  };
}
