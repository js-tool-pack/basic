import { calcArr } from './calcArr';

/**
 * 乘法计算，直接计算有精度问题
 *
 * @example
 *
 * // 0.2 * 0.1 = 0.020000000000000004
 * 0.2 * 0.1; // 0.020000000000000004
 * times(0.2, 0.1); // 0.02
 *
 */
export function times(num: number, ...nums: Array<number>) {
  return calcArr(num, nums, (a, b, pow) => (pow * a * (b * pow)) / (pow * pow));
}
