import { typeOf } from './typeOf';

/**
 * 判断目标是否是字符串
 *
 * 判定方式：typeOf(target) === 'string'
 *
 * ```ts
 * isString(123123); // false
 * isString(''); // true
 * isString(``); // true
 *```
 */
export function isString(target: unknown): target is string {
  return typeOf(target) === 'string';
}
