import { typeOf } from './typeOf';

/**
 * 判定目标是否是数字
 *
 * 判定方式：typeOf(target) === 'number'
 *
 * @example
 *
 * isNumber(''); // false
 * isNumber({}); // false
 * isNumber({ 0: 1, 1: 2, length: 2 }); // false
 * isNumber(() => {}); // false
 * isNumber(true); // false
 * isNumber(undefined); // false
 * isNumber(null); // false
 * isNumber([1, 2, 3]); // false
 * isNumber([]); // false
 * isNumber(NaN); // true
 * isNumber(123); // true
 */
export function isNumber(target: unknown): target is number {
  return typeOf(target) === 'number';
}
