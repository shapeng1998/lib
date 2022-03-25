import { myReduce } from './myReduce';

export function myFlat<A, D extends number = 1>(
  arr: A,
  depth = 1
): FlatArray<A, D>[] {
  return myReduce(
    arr as unknown as FlatArray<A, D>[],
    (prev, cur) => {
      if (Array.isArray(cur) && depth > 1) {
        return prev.concat(myFlat(cur, depth - 1) as FlatArray<A, D>);
      }
      return prev.concat(cur as FlatArray<A, D>);
    },
    [] as FlatArray<A, D>[]
  );
}
