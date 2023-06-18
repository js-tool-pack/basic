/**
 * 判断字符串是否是百分比
 * @example
 *
 * isPercent('123$%'); // false
 * isPercent('3%'); // true
 * isPercent('3.0%'); // true
 * isPercent('3.1%'); // true
 * isPercent('100%'); // true
 * isPercent('100%'); // true
 * isPercent('100%1'); // false
 * isPercent('100% '); // true
 * isPercent('10..0% '); // false
 * isPercent('10.0.0% '); // false
 * isPercent('.1% '); // false
 * isPercent(''); // false
 * isPercent(' '); // false
 */
export function isPercent(value: string): boolean {
  const reg = /^\d+(\.\d+)?%$/;
  return reg.test(value.trim());
}
