import { isEqual } from './isEqual';

/**
 * 递归判断两个对象是否相等
 * @example
 *
 * const obj = { a: 1 };
 * objectIsEqual(obj, obj); // true
 * objectIsEqual(obj, { a: 1 }); // true
 * objectIsEqual(obj, { a: 2 }); // false
 */
export function objectIsEqual(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
  if (obj1 === obj2) return true;
  for (const key in obj1) {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (!isEqual(value1, value2)) {
      return false;
    }
  }
  return true;
}
