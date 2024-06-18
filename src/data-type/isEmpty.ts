import { isEmptyObject } from './isEmptyObject';
import { typeOf } from './typeOf';

/**
 * 判断是否是空值 undefined, null, "", [], {} ,NaN都为true
 *
 * @example
 *
 * isEmpty(NaN); // true
 * isEmpty(''); // true
 * isEmpty({}); // true
 * isEmpty([]); // true
 * isEmpty({ a: 1 }); // false
 * isEmpty([1]); // false
 * isEmpty(0); // false
 * isEmpty(function () {}); // false
 * isEmpty({ a: function () {}})); // false;
 */
export function isEmpty(target: any): boolean {
  if ([undefined, null, NaN, ''].includes(target)) return true;
  switch (typeOf(target)) {
    case 'array':
      return !target.length;
    case 'object':
      // {a(){}} 使用JSON.stringify是会判断为空的
      // return JSON.stringify(target) === "{}";
      return isEmptyObject(target);
  }
  return false;
}
