import { calcArr } from './calcArr';

/**
 * 除法计算，直接计算有精度问题
 *
 * @example
 *
 * // 0.3 / 0.1 = 2.9999999999999996
 * 0.3 / 0.1; // 2.9999999999999996
 * divide(0.3, 0.1); // 3
 *
 */
export function divide(num: number, ...nums: Array<number>) {
  return calcArr(num, nums, (a, b, pow) => (a * pow) / (b * pow));
}
