import { isArray } from './isArray';

/**
 * 判断是否是数组对象
 *
 * @example
 * isArrayObj(Object.assign([1, 2], { b: '1', c: '2' })); // true
 * isArrayObj([]); // false
 * isArrayObj({ 0: 1, 1: 2, length: 2, a: 1, b: 2 }); // false
 * isArrayObj(document.querySelectorAll('.test')); // false
 * isArrayObj(document.getElementsByClassName('test')); // false
 */
export function isArrayObj(value: any): boolean {
  const reg = /\d+/;
  return isArray(value) && Object.keys(value).some((i) => !reg.test(i));
}
