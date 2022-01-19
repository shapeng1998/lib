export function quickSort<T>(
  arr: Array<T>,
  compareFunction: (a: T, b: T) => number
) {
  function sort(l: number, r: number) {
    if (l >= r) return;

    let i = l - 1;
    let j = r + 1;
    let x = arr[(i + j) >>> 1];

    while (i < j) {
      do i++;
      while (compareFunction(arr[i], x) < 0);
      do j--;
      while (compareFunction(arr[j], x) > 0);
      if (i < j) [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    sort(l, j);
    sort(j + 1, r);
  }

  sort(0, arr.length - 1);

  return arr;
}
