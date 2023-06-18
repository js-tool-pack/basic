import { hasOwn } from '../common';

/**
 * 遍历对象属性
 *
 * 代替Object.keys(obj).forEach
 *
 * @example
 *
 * const obj = { a: 1, b: 2, c: 3 };
 * function feo(obj: object) {
 *   const arr: any[] = [];
 *
 *   forEachObj(obj, (v, k, obj) => {
 *     arr.push([v, k, obj]);
 *   });
 *   return arr;
 * }
 *
 * isEqual(feo(obj),
 *   Object.keys(obj).reduce((res, key) => {
 *     res.push([obj[key], key, obj]);
 *     return res;
 *   }, [] as any[]),
 * ); // true
 *
 * feo(obj).length; // 3
 * // 不会遍历继承的属性
 * feo(Object.create(obj)).length; // 0
 *
 * @param obj 要遍历的对象
 * @param callbackFn 返回false的时候中断
 * @param elseCB 遍历完后执行
 * @returns {boolean} isDone
 */
export function forEachObj<T extends object>(
  obj: T,
  callbackFn: (value: T[keyof T], key: keyof T, obj: T) => void | false,
  elseCB?: () => any,
): boolean {
  for (const k in obj) {
    if (!hasOwn(obj, k)) continue;
    const v = obj[k];
    if (callbackFn(v, k, obj) === false) return false;
  }
  elseCB && elseCB();
  return true;
}
