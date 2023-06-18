import { hasOwn } from './hasOwn';

/**
 * 合并两个object
 *
 * TODO 可优化
 *
 * @example
 *
 * // 对象合并
 * const a = { one: 1, two: 2, three: 3 };
 * const b = { one: 11, four: 4, five: 5 };
 * deepMerge(a, b); // Object.assign({}, a, b)
 *
 * // 嵌套对象合并
 * const c = { ...a, test: { a: 1, b: 2, c: 3 } };
 * deepMerge(c, b); // Object.assign({}, c, b)
 * deepMerge(c, b).test.a === 1; // true
 * // 第二个对象中不存在属性也会重新复制
 * deepMerge(c, b).test !== c.test; // true
 *
 * // 合并类实例
 * function Fn(this: any) {
 *   this.a = 100;
 * }
 *
 * Fn.prototype.b = 200;
 *
 * const d = new Fn();
 * deepMerge(a, d); // Object.assign({}, a, d)
 * // 不会合并继承属性
 * deepMerge(a, d).b; // undefined
 *
 * deepMerge(a, { a: [{ b: 123 }] }); // Object.assign({}, a, { a: [{ b: 123 }] })
 *
 */
export function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
  first: T,
  second: U,
): T & U {
  function assign(receive: Record<string, any>, obj: any) {
    for (const k in obj) {
      if (!hasOwn(obj, k)) continue;
      const v = obj[k];
      if (v && typeof v === 'object') {
        receive[k] = new v.constructor();
        assign(receive[k], v);
      } else receive[k] = v;
    }
  }
  const result: any = {};
  assign(result, first);
  assign(result, second);
  return result;
}
