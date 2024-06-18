import { forEachRight } from '../../array';
import { isNaN } from '../../data-type';
import { reduceObj } from '../iterate';
import { hasOwn } from '../common';

/**
 * 根据与target对比，挑出与target同key不同value的key所组成的object
 *
 * @example
 *
 * const obj1 = { a: 12, b: undefined, c: 3 };
 * pickUpdated(obj1, [{ a: 1 }, { b: 2 }, { d: 3 }]); // { a: 1, b: 2 }
 * pickUpdated(obj1, [{ a: 1 }, { a: 2 }, { a: 5 }]); // { a: 5 }
 * pickUpdated(obj1, [{ a: 1 }, { a: 2 }, { a: 12 }]); // {}
 * pickUpdated(obj1, [{ a: 12 }, { b: undefined }, { c: 3 }]); // {}
 * pickUpdated({}, [{ a: 1 }, { b: 2 }, { d: 3 }]); // {}
 * pickUpdated({ a: NaN }, [{ a: 1 }, { a: NaN }]); // {}
 * pickUpdated({ a: NaN }, [{ a: 1 }, null as any]); // { a: 1 }
 * pickUpdated({ a: NaN }, [null as any]); // {}
 * pickUpdated({ a: NaN }, [undefined as any]); // {}
 *
 * @param target 目标对象
 * @param objs  相当于assign(...objs) 同样的key只会取最后一个
 * @param compareFn 比较回调
 */
export function pickUpdated<T extends object>(
  target: T,
  objs: object[],
  compareFn: (a: unknown, b: unknown) => boolean = (a, b) => a === b || (isNaN(a) && isNaN(b)),
): Partial<{ [k in keyof T]: any }> {
  return reduceObj(
    target,
    (result, _v, k) => {
      forEachRight(objs, function (item: any): false | void {
        if (item && hasOwn(item, k)) {
          if (!compareFn(target[k], item[k])) {
            result[k] = item[k];
          }
          return false;
        }
      });
      return result;
    },
    {} as any,
  );
}
