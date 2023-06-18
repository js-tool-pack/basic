/**
 * 代替for循环
 *
 * forEachNum的反向遍历版本
 *
 * @see forEachNum
 *
 * @example
 *
 * const arr: number[] = [];
 * forEachNumRight(3, (index) => arr.push(index));
 * arr; // [0, 1, 2].reverse()
 * forEachNumRight(7, (index) => arr.push(index));
 * arr.length; // 10
 * forEachNumRight(3, (index): void | false => {
 *   arr.push(index);
 *   if (index === 1) return false;
 * });
 * arr; // [...[0, 1, 2].reverse(), ...[0, 1, 2, 3, 4, 5, 6].reverse(), 2, 1]
 *
 */
export function forEachNumRight(len: number, callback: (index: number) => any | false) {
  for (let i = len - 1; i >= 0; i--) {
    if (callback(i) === false) break;
  }
}
