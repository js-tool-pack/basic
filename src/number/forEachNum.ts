/**
 * 代替for循环
 *
 * @example
 *
 * const arr: number[] = [];
 * forEachNum(3, (index) => arr.push(index));
 * arr; // [0, 1, 2]
 * forEachNum(7, (index) => arr.push(index));
 * arr.length; // 10
 * forEachNum(3, (index): void | false => {
 *   arr.push(index);
 *   if (index === 1) return false;
 * });
 * arr; // [0, 1, 2, 0, 1, 2, 3, 4, 5, 6, 0, 1]
 */
export function forEachNum(len: number, callback: (index: number) => false | any) {
  for (let i = 0; i < len; i++) {
    if (callback(i) !== false) continue;
    break;
  }
}
