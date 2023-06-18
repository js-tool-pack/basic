/**
 * 在跟Array.prototype.findIndex基础上添加对ArrayLike支持，且可以跟findIndexRight配套使用
 *
 * @example
 *
 *  // 中途删除
 * const i = [1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1].findIndex((v, index, a) => {
 *   if (v === 1) a.splice(index, 1);
 *   return v === 4;
 * });
 * i; // 3
 *
 * const i2 = findIndex([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1], (v, index, a) => {
 *   if (v === 1) (a as number[]).splice(index, 1);
 *   return v === 4;
 * });
 * i2; // 3
 *
 * findIndex([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1], (v) => v === 4); // 5
 * findIndex([{ v: 1 }, { v: 2 }], (v) => v.v === 4); // -1
 * findIndex([{ v: 1 }, { v: 2 }], (v) => v.v === 2); // 1
 *
 * findIndex([], undefined as any); // -1
 *
 */
export function findIndex<T>(
  arr: ArrayLike<T>,
  predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean,
): number {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const item = arr[i] as T;
    if (predicate(item, i, arr as any)) return i;
  }
  return -1;
}
