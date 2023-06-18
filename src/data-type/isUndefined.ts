/**
 * 判断目标是否是undefined
 *
 * 判定方式：target === void 0
 *
 * 最安全的方式还是直接用 typeof target === 'undefined' 判断，
 * 这种方式就算target是未声明的变量也不会报错
 *
 * @example
 *
 * isUndefined(0); // false
 * isUndefined(123123); // false
 * isUndefined(''); // false
 * isUndefined(null); // false
 * isUndefined([]); // false
 * isUndefined(undefined); // true
 * let a;
 * isUndefined(a); // true
 */
export function isUndefined(target: any): target is undefined {
  return target === void 0;
}
