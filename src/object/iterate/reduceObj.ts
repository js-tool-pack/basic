import { forEachObj } from './forEachObj';

/**
 *
 * 代替Object.keys(obj).reduce
 *
 * @example
 *
 * const obj = { a: 1, b: 2, c: '3' };
 * reduceObj(obj, (r, v, k) => ((r[v] = k), r), {} as Record<string, any>); // { 1: 'a', 2: 'b', 3: 'c' }
 *
 * @param obj 要遍历的对象
 * @param callbackFn 回调
 * @param initialValue 初始值 数组中可以省略，默认使用数组中的第一项作为初始值，但object不存在第一项，所以不能省略
 */
export function reduceObj<T extends object, R>(
  obj: T,
  callbackFn: (previousValue: R, value: T[keyof T], key: keyof T, obj: T) => R,
  initialValue: R,
): R {
  let result = initialValue;
  forEachObj(obj, (v, k, o) => {
    result = callbackFn(result, v, k, o);
  });
  return result;
}
