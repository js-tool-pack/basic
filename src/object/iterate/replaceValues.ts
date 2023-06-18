import { forEachObj } from './forEachObj';

/**
 * 替换数组或对象的value
 *
 * @example
 *
 * const obj = { a: 1, b: 2 };
 * replaceValues(obj, String); // { a: '1', b: '2' }
 * console.log(obj); // { a: '1', b: '2' }
 *
 * const arr = [1, 2, 3];
 * replaceValues(arr, String); // ['1', '2', '3']
 * console.log(arr); // ['1', '2', '3']
 */
export function replaceValues<T extends Record<string, unknown> | Array<unknown>>(
  target: T,
  replacement: (v: unknown, k: string, target: T) => unknown,
) {
  forEachObj(target, (v, k): void => {
    (target as any)[k] = replacement(v, k as string, target);
  });
  return target;
}
