import { randomInt } from './randomInt';

/**
 * 随机获取数组中的一个
 *
 * @example
 *
 * randomItem([1, 2, 3]); // 返回1-3中的一个
 *
 */
export function randomItem<T>(arr: T[]): T {
  const index = randomInt(arr.length);
  return arr[index] as T;
}
