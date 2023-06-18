/**
 * 获取小数点后面数字的长度,支持科学计数法
 *
 * from number-precision
 *
 * @example
 *
 * // 数字
 * getNumberLenAfterDot(0.12345667); // 8
 * getNumberLenAfterDot(12345); // 0
 *
 * // 字符串
 * getNumberLenAfterDot('0.123456789'); // 9
 * getNumberLenAfterDot('abc'); // 0
 *
 * // 科学计数法
 * getNumberLenAfterDot(1.123e5); // 0
 * getNumberLenAfterDot(1.123e2); // 1
 * getNumberLenAfterDot(1.123e2); // 1
 * getNumberLenAfterDot(1e2); // 0
 * getNumberLenAfterDot(1e-2); // 2
 *
 */
export function getNumberLenAfterDot(num: number | string): number {
  Number(1000).toPrecision();
  const eSplit = String(num).split(/[eE]/);
  const len = (eSplit[0]?.split('.')[1] || '').length - +(eSplit[1] || 0);
  return len > 0 ? len : 0;
}
