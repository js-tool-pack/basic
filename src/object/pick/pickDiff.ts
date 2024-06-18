import { forEachObj } from '../iterate';
import { isNaN } from '../../data-type';
import { hasOwn } from '../common';

/**
 * 从其他对象中挑出与原对象值不一样的或原对象中不存在的键值对所组成的新对象
 *
 * @example
 *
 * pickDiff({ a: 1 }, []); // {}
 * pickDiff({ a: 1 }, [{ a: 1 }]); // {}
 * pickDiff({ a: 1 }, [{ a: 2 }]); // { a: 2 }
 * pickDiff({ a: 1 }, [{ b: 2 }]); // { b: 2 }
 * pickDiff({ a: 1 }, [{ b: 2 }, { a: 1, c: 3 }, { a: 3 }]); // { a: 3, b: 2, c: 3 }
 * pickDiff({ a: NaN }, [{ a: NaN, b: 1 }]); // { b: 1 }
 *
 * const a = { a: { id: 123 } };
 * const b = { a: { id: 123 } };
 * // 虽然值一样，但引用不一样，所以a会被pick出来
 * pickDiff(a, [b]); // { a: { id: 123 } }
 * // 通过id判断两个对象是否一样
 * pickDiff(a, [b], (v1, v2, k, origin, obj) => v1.id === v2.id}); // {}
 *
 */
export function pickDiff(
  origin: object,
  objs: object[],
  verify?: (originV: any, objV: any, k: string | number, origin: object, obj: object) => boolean,
): {
  [k: string]: any;
} {
  const verifyFn =
    verify ||
    ((originV, objV, k, origin) => {
      return (hasOwn(origin, k) && originV === objV) || (isNaN(originV) && isNaN(objV));
    });
  return objs.reduce((result, obj) => {
    forEachObj(obj, (v, k) => {
      if (verifyFn(origin[k], v, k, origin, obj)) return;
      result[k] = v;
    });
    return result;
  }, {});
}
