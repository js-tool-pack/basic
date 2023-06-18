/**
 * findIndex反向遍历版本
 *
 * @example
 * const list = [1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1];
 * const result: number[] = [];
 * const i = findIndexRight(list, (v) => (result.push(v), v === 4));
 * i; // 5
 * result; // [1, 1, 1, 1, 1, 4]
 * findIndexRight([{ v: 1 }, { v: 2 }], (v) => v.v === 4); // -1
 * findIndexRight([{ v: 1 }, { v: 2 }], (v) => v.v === 2); // 1
 *
 * findIndexRight([], undefined as any); // -1
 */
export function findIndexRight<T>(
  arr: ArrayLike<T>,
  predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean,
): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = arr[i] as T;
    if (predicate(item, i, arr as any)) return i;
  }
  return -1;
}
