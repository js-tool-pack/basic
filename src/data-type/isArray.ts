import { typeOf } from './typeOf';

/**
 * 判断目标是否是数组
 *
 * 判定方式：typeOf(target) === 'array'
 *
 * 跟Array.isArray()一样
 *
 * @example
 *
 * Array.isArray(0.12345667); // false
 * isArray(0.12345667); // false
 *
 * Array.isArray(''); // false
 * isArray(''); // false
 *
 * Array.isArray({}); // false
 * isArray({}); // false
 *
 * Array.isArray({ 0: 1, 1: 2, length: 2 }); // false
 * isArray({ 0: 1, 1: 2, length: 2 }); // false
 *
 * Array.isArray(() => {}); // false
 * isArray(() => {}); // false
 *
 * Array.isArray(true); // false
 * isArray(true); // false
 *
 * Array.isArray(NaN); // false
 * isArray(NaN); // false
 *
 * Array.isArray(undefined); // false
 * isArray(undefined); // false
 *
 * Array.isArray(null); // false
 * isArray(null); // false
 *
 * Array.isArray([1, 2, 3]); // true
 * isArray([1, 2, 3]); // true
 *
 * Array.isArray([]); // true
 * isArray([]); // true
 *
 * Array.isArray(document.getElementsByClassName('test')); // false
 * isArray(document.getElementsByClassName('test')); // false
 */
export function isArray<T = unknown>(target: unknown): target is Array<T> {
  return typeOf(target) === 'array';
}
