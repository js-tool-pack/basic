/**
 * 数组求和
 *
 * @example
 *
 * sum([0, 20, 100]); // 120
 * sum([-10, 20, 100]); // 110
 */
export function sum(arr: number[]): number {
  return arr.reduce((res, item) => item + res, 0);
}
