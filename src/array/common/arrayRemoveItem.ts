/**
 * 从数组中移除item
 *
 * @example
 *
 * const a1 = [1, 2, 3, 4, 5];
 *
 * arrayRemoveItem(a1, 100); // undefined
 * a1; // [1, 2, 3, 4, 5]
 * arrayRemoveItem(a1, 1); // 1
 * a1; // [2, 3, 4, 5]
 *
 */
export function arrayRemoveItem<T>(array: T[], item: T): void | T {
  const index = array.indexOf(item);
  if (index === -1) return;
  return array.splice(index, 1)[0];
}
