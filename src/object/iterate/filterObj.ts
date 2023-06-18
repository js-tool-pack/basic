import { reduceObj } from '../iterate';

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
