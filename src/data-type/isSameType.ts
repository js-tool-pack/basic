import { typeOf } from './typeOf';

/**
 * 判断两个数据类型是否相等
 *
 * @example
 *
 * isSameType(cm, cm); // true
 * isSameType(1, 2); // true
 * isSameType('', new String(123)); // true
 * isSameType(1, NaN); // true
 * isSameType(1, ''); // false
 * isSameType({}, []); // false
 * isSameType({}, () => 0); // false
 * isSameType({}, null); // false
 */
export function isSameType(a: unknown, b: unknown): boolean {
  return typeOf(a) === typeOf(b);
}
