import { sum } from './sum';

/**
 * 数组求平均值
 *
 * @example
 *
 * avg([20, 20, 20]); // 20
 * avg([-10, 20, 20]); // 10
 *
 */
export function avg(arr: number[]): number {
  return sum(arr) / arr.length;
}
