import { hasOwn } from './common';

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

/**
 * 过滤对象属性
 *
 * 代替Object.keys(target).filter()
 *
 * @example
 *
 * const obj = { a: '', b: 123, c: 0, d: undefined, e: false, f: NaN, g: null };
 * filterObj(obj); // { b: 123 }
 * filterObj(obj, (v) => v !== undefined); // omit(obj, ['d'])
 *
 */
export function filterObj(
  obj: Record<string, any>,
  predicate: (v: any, k: string) => boolean = (v) => v,
): object {
  return reduceObj(
    obj,
    (init, v, k) => {
      if (predicate(v, k)) {
        init[k] = v;
      }
      return init;
    },
    {} as Record<string, any>,
  );
}
