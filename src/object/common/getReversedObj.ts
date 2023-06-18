import { reduceObj } from '../iterate';

/**
 * object {key:value}翻转成{value:key}
 *
 * @example
 * const obj = { a: 'aa', b: 'bb' };
 * fn(obj); // { aa: 'a', bb: 'b' }
 *
 */
export function getReversedObj(obj: { [k: string]: string }): {
  [k: string]: string;
} {
  return reduceObj(
    obj,
    (res, v, k) => {
      res[v] = k;
      return res;
    },
    {} as Record<string, any>,
  );
}
