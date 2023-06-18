import type { TupleM2N } from '@tool-pack/types';

/**
 * 数字千位分隔
 *
 * Number.prototype.toLocaleString 也能转成千位分隔数字字符串
 *
 * @example
 *
 * // 小数位不转换
 * formatNumber(123456789); // '123,456,789'
 * formatNumber(123); // '123'
 * formatNumber(5763423); // '5,763,423'
 * formatNumber(123123.1111); // '123,123.1111'
 *
 * // 小数位转换
 * formatNumber(123.11, true); // '123.11'
 * formatNumber(123123.1111, true); // '123,123.111,1'
 * formatNumber(12312311.111111, true); // '12,312,311.111,111'
 * formatNumber(12312311.111111); // '12,312,311.111111'
 * formatNumber(12312311.111111, true, ' '); // '12 312 311.111 111'
 *
 * @param num
 * @param [isFormatDecimalPlaces=false] 是否格式化小数位
 * @param [delimiter = ","]
 */
export function formatNumber(
  num: string | number,
  isFormatDecimalPlaces = false,
  delimiter = ',',
): string {
  // 123123.1111 => 123,123.1,111
  // return String(num).replace(/\B(?=(?:\d{3})+(?!\d))/g, delimiter);
  const split = String(num).split('.') as TupleM2N<string, 1, 2>;
  split[0] = split[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, delimiter);
  if (split.length === 1 || !isFormatDecimalPlaces) return split.join('.');
  split[1] = split[1].replace(/(\d{3})/g, `$1${delimiter}`);
  return split.join('.').replace(new RegExp(`${delimiter}$`), '');
}
