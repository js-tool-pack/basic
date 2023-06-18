import { getCommonPow } from './getCommonPow';

/**
 * @see plus
 * @see divide
 * @see times
 * @see divide
 */
export function calcArr(
  num: number,
  nums: number[],
  callback: (a: number, b: number, pow: number) => number,
): number {
  return nums.reduce<number>((a, b) => {
    const pow = getCommonPow(a, b);
    return callback(a, b, pow);
  }, num);
}
