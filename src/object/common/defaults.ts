import { forEachObj } from '../iterate';

/**
 * 与lodash defaults一样 只替换origin里面的值为undefined的属性
 *
 * 在原对象上改
 *
 * @example
 *
 * const origin = { a: 12, b: undefined, c: 3, d: null, 0: undefined };
 * // 0个参数
 * defaults({ ...origin }); // origin
 * defaults({ ...origin }, null); // origin
 * defaults({ ...origin }, 1); // origin
 * // 1个参数
 * defaults({ ...origin }, { a: 1, b: 1 }); // { ...origin, b: 1 }
 * defaults({ ...origin }, '123'); // { ...origin, 0: '1', 1: '2', 2: '3' }
 */
export function defaults<T, U>(origin: T, source: U): T & U;
/**
 * 与lodash defaults一样 只替换origin里面的值为undefined的属性
 *
 * 在原对象上改
 *
 * @example
 *
 * const origin = { a: 12, b: undefined, c: 3, d: null, 0: undefined };
 * // 2个参数
 * defaults({ ...origin }, { a: 1, b: 1 }, { f: 5 }); // { ...origin, b: 1, f: 5 }
 */
export function defaults<T, U, V>(origin: T, source1: U, source2: V): T & U & V;
/**
 * 与lodash defaults一样 只替换origin里面的值为undefined的属性
 *
 * 在原对象上改
 *
 * @example
 *
 * const origin = { a: 12, b: undefined, c: 3, d: null, 0: undefined };
 * // 3个参数
 * defaults({ ...origin }, { a: 1, b: 1 }, { c: 0, d: 4 }, { f: 5, g: 6 }); // {...origin, b: 1, f: 5, g: 6, }
 *
 */
export function defaults<T, U, V, W>(origin: T, source1: U, source2: V, source3: W): T & U & V & W;
/**
 * 与lodash defaults一样 只替换origin里面的值为undefined的属性
 *
 * 在原对象上改
 *
 * @example
 *
 * const origin = { a: 12, b: undefined, c: 3, d: null, 0: undefined };
 * // 更多参数
 * defaults({ ...origin }, { a: 1, b: 1 }, { c: 0, d: 4 }, { f: 5, g: 6 }, { h: 7, i: 8 }),; // { ...origin, b: 1, f: 5, g: 6, h: 7, i: 8 }
 *
 */
export function defaults(origin: object, ...args: object[]): object;
export function defaults(origin: Record<string, any>, ...args: any[]) {
  args.forEach((arg) => {
    forEachObj(arg, (v, k) => {
      if (v === undefined || origin[k as string] !== undefined) return;
      origin[k as string] = v;
    });
  });
  return origin;
}
