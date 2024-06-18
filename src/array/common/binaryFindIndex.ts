/**
 * 二分查找item index
 *
 * @example
 *
 *  let findTimes = 0;
 * const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
 *
 * binaryFindIndex(arr, (o) => (findTimes++, 3 - o.item.id)); // id等于3的item的index是2
 * findTimes; // 查找遍历次数：3
 *
 * findTimes = 0;
 * binaryFindIndex(arr, (o) => (findTimes++, 2 - o.item.id)); // id等于2的item的index是1
 * findTimes; // 查找遍历次数：2
 *
 * findTimes = 0;
 * binaryFindIndex(arr, (o) => (findTimes++, 6 - o.item.id)); // id等于6的item的index是5
 * findTimes; // 查找遍历次数：2
 *
 * findTimes = 0;
 * binaryFindIndex(arr, (o) => (findTimes++, 7 - o.item.id)); // id等于7的item的index是-1
 * findTimes; // 查找遍历次数：2
 *
 * @param arr 要查找的数组
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 */
export function binaryFindIndex<T>(
  arr: T[],
  handler: (options: { index: number; start: number; end: number; arr: T[]; item: T }) => number,
): number {
  if (arr.length === 0) return -1;
  let start = 0;
  let end = arr.length;
  do {
    const middleIndex = Math.floor((end - start) / 2) + start;
    const value: number = handler({
      item: arr[middleIndex] as T,
      index: middleIndex,
      start,
      end,
      arr,
    });
    if (value === 0) {
      return middleIndex;
    } else if (value > 0) {
      start = middleIndex + 1;
    } else {
      end = middleIndex;
    }
  } while (end > start);
  return -1;
}
