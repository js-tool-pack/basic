import { typeOf } from './typeOf';

/**
 * 判断目标是否是对象，不包含Array,Function
 *
 * 判定方式：typeOf(target) === 'object'
 *
 * @example
 * isObject(123123); // false
 * isObject(undefined); // false
 * isObject(123123); // false
 * isObject(''); // false
 * // null
 * typeof null === 'object'; // true
 * isObject(null); // false
 * // array
 * typeof [] === 'object'; // true
 * isObject([]); // false
 * //
 * isObject({}); // true
 * // function
 * const f = () => {};
 * typeof f === 'object'; // false
 * isObject(f); // false
 * isObject(function () {}); // false
 *
 */
export function isObject(target: unknown): target is object {
  return typeOf(target) === 'object';
}
