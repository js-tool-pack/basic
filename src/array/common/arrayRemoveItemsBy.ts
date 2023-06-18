import { forEachRight } from './forEachRight';

/**
 * 从数组中移除多个item
 *
 * 没和arrayRemoveItem合并是因为无法区分function[]中的第二个参数是item还是，查找回调函数
 *
 * @example
 *
 * const a1 = [1, 2, 3, 4, 5];
 *
 * arrayRemoveItemsBy(a1, (v) => v === 100); // []
 * a1; // [1, 2, 3, 4, 5]
 * arrayRemoveItemsBy(a1, (v) => v === 1); // [1]
 * a1; // [2, 3, 4, 5]
 *
 */
export function arrayRemoveItemsBy<T>(
  array: T[],
  removeBy: (v: T, k: number, a: T[]) => boolean,
): T[] {
  const removedItems: T[] = [];
  forEachRight(array, (v: T, k, a) => {
    if (!removeBy(v, k, a as T[])) return;
    const item = array.splice(k, 1)[0] as T;
    removedItems.unshift(item);
  });
  return removedItems;
}
