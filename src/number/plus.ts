import { calcArr } from './calcArr';

/**
 * 加法计算，直接计算有精度问题
 *
 * // 0.1 + 0.2 = 0.30000000000000004
 * 0.1 + 0.2; // 0.30000000000000004
 * plus(0.1, 0.2); // 0.3
 *
 */
export function plus(num: number, ...nums: Array<number>) {
  return calcArr(num, nums, (a, b, pow) => (a * pow + b * pow) / pow);
}
