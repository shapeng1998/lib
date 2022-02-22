export function debounce(func: Function, wait: number = 0) {
  let timeout: number;
  return function (...args: any[]) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      func(...args);
    }, wait);
  };
}
