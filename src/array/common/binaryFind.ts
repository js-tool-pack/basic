import { binaryFindIndex } from './binaryFindIndex';

/**
 * 二分查找item
 *
 * @see binaryFindIndex
 *
 * @example
 *
 * let findTimes = 0;
 * const arr = [
 *   { id: 1, text: '1' },
 *   { id: 2, text: '2' },
 *   { id: 3, text: '3' },
 *   { id: 4, text: '4' },
 *   { id: 5, text: '5' },
 *   { id: 6, text: '6' },
 * ];
 *
 * binaryFind(arr, (o) => (findTimes++, 3 - o.item.id)); // { id: 3, text: '3' }
 * findTimes; // 查找遍历次数：3
 *
 * findTimes = 0;
 * binaryFind(arr, (o) => (findTimes++, 2 - o.item.id)); // { id: 2, text: '2' }
 * findTimes; // 查找遍历次数：2
 *
 * findTimes = 0;
 * binaryFind(arr, (o) => (findTimes++, 6 - o.item.id)); // { id: 6, text: '6' }
 * findTimes; // 查找遍历次数：2
 *
 * findTimes = 0;
 * binaryFind(arr, (o) => (findTimes++, 7 - o.item.id)); // null
 * findTimes; // 查找遍历次数：2
 *
 * @param arr 要查找的数组
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 */
export function binaryFind<T>(
  arr: T[],
  handler: (options: { index: number; start: number; end: number; arr: T[]; item: T }) => number,
): null | T {
  const index = binaryFindIndex(arr, handler);
  if (index === -1) return null;
  return arr[index as keyof typeof arr] as T;
}
