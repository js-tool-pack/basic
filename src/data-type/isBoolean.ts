import { typeOf } from './typeOf';

/**
 * 判断目标是否是boolean
 *
 * 判定方式：typeOf(target) === 'boolean'
 *
 * @example
 *
 * isBoolean(0); // false
 * isBoolean(123123); // false
 * isBoolean(undefined); // false
 * isBoolean(''); // false
 * isBoolean(null); // false
 * isBoolean([]); // false
 * isBoolean({}); // false
 *
 */
export function isBoolean(target: unknown): target is boolean {
  return typeOf(target) === 'boolean';
}
