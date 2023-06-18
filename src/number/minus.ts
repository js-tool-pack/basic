import { calcArr } from './calcArr';

/**
 * 减法计算，直接计算有精度问题
 *
 * @example
 *
 * // 0.3 - 0.1 = 0.19999999999999998
 * 0.3 - 0.1; // 0.19999999999999998
 * minus(0.3, 0.1); // 0.2
 *
 */
export function minus(num: number, ...nums: Array<number>) {
  return calcArr(num, nums, (a, b, pow) => (a * pow - b * pow) / pow);
}
