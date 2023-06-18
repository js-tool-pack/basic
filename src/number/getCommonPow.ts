import { getNumberLenAfterDot } from './getNumberLenAfterDot';

/**
 * 获取两位数乘后都能为整数的数字
 *
 * @example
 *
 * getCommonPow(0.1, 0.11); // 100
 * getCommonPow(1.123e2, 0.11); // 100
 * getCommonPow(1e2, 10); // 1
 * getCommonPow(1e-2, 10); // 100
 * getCommonPow(10.1, 1.00001); // 100000
 *
 */
export function getCommonPow(a: number, b: number): number {
  const aLen = getNumberLenAfterDot(a);
  const bLen = getNumberLenAfterDot(b);
  return Math.pow(10, Math.max(aLen, bLen));
}
