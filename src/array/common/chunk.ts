import type { TupleM2N } from '@tool-pack/types';

/**
 * 数组分片
 * @example
 * chunk([0,1,2,3,4,5,6], 3) // => [[0,1,2],[3,4,5],[6]]
 *
 * chunk([0, 1, 2, 3, 4, 5, 6], 10); // [[0, 1, 2, 3, 4, 5, 6]]
 * chunk([0, 1, 2, 3, 4, 5, 6], 1); // [[0], [1], [2], [3], [4], [5], [6]]
 * chunk([0, 1, 2, 3, 4, 5, 6], 0); // [0, 1, 2, 3, 4, 5, 6]
 * chunk([0, 1, 2, 3, 4, 5, 6], -1); // [0, 1, 2, 3, 4, 5, 6]
 * chunk([0, 1, 2, 3, 4, 5, 6], 3); // [[0, 1, 2], [3, 4, 5], [6]]
 * chunk([0, 1, 2, 3, 4, 5], 3); // [[0, 1, 2], [3, 4, 5]]
 * chunk([0, 1, 2, 3, 4], 3); // [[0, 1, 2], [3, 4]]
 * const emptyArr: any[] = [];
 * chunk(emptyArr, 3); // []
 * chunk(emptyArr, 3) !== emptyArr; // true
 * chunk({} as any, 3); // []
 *
 */
export function chunk<T, L extends number>(arr: ArrayLike<T>, chunkLen: L): TupleM2N<T, 0, L>[] {
  if (chunkLen < 1) return Array.prototype.slice.call(arr);
  const result: any[] = [];
  let i = 0;
  while (i < arr.length) {
    result.push(Array.prototype.slice.call(arr, i, (i += chunkLen)));
  }
  return result;
}
