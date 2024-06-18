import type { ReverseObject } from '@tool-pack/types';
import { reduceObj } from '../iterate';

/**
 * object {key:value}翻转成{value:key}
 *
 * @example
 * const obj = { a: 'aa', b: 'bb' };
 * fn(obj); // { aa: 'a', bb: 'b' }
 *
 */
export function getReversedObj<const T extends object>(obj: T): ReverseObject<T> {
  return reduceObj(
    obj,
    (res, v, k) => {
      res[v] = k;
      return res;
    },
    {} as any,
  );
}
