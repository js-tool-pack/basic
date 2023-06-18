import { isObject } from './isObject';

/**
 * 判断是否是空object
 *
 * @example
 * isEmptyObject({}); // true
 * isEmptyObject({ a: 1 }); // false
 * isEmptyObject({ true: 1 }); // false
 * isEmptyObject({ false: 1 }); // false
 * isEmptyObject({ 0: 1 }); // false
 * isEmptyObject({ undefined: 1 }); // false
 * isEmptyObject({ null: 1 }); // false
 * isEmptyObject([]); // false
 * isEmptyObject(function () {}); // false
 */
export function isEmptyObject(target: object): boolean {
  if (!isObject(target)) return false;
  for (const i in target) {
    return i === undefined;
  }
  return true;
}
