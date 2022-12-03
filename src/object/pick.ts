import { isNaN, isObject } from '../data-type';
import { forEachRight } from '../array';
import { hasOwn } from './common';
import { forEachObj, reduceObj } from './iterate';

/**
 * 通过key数组挑选出key数组组成的对象
 *
 * @example
 *
 * const obj = { a: 1, b: '2', c: ['12313', 111], d: false, e: { a: 1 }, f: undefined };
 *
 * pickByKeys(obj, []); // {}
 * pickByKeys(obj, ['a']); // { a: 1 }
 * pickByKeys(obj, ['b']); // { b: obj.b }
 * pickByKeys(obj, ['c']); // { c: obj.c }
 * pickByKeys(obj, ['a'], (v) => v + 1000); // { a: 1001 }
 * // 不存在于对象中的属性会忽略
 * pickByKeys(obj, ['g' as any]); // {}
 *
 * @param originObj 遍历对象
 * @param pickKeys 需要挑选的key数组
 * @param cb 对值进行修改
 */
export function pickByKeys<T extends object, K extends keyof T>(
  originObj: T,
  pickKeys: K[],
  cb?: (value: T[K], key: K, originObj: T) => Pick<T, K>[K],
): Pick<T, K> {
  const callback = cb || ((v) => v);
  return pickKeys.reduce((res, key) => {
    if (hasOwn(originObj, key)) res[key] = callback(originObj[key], key, originObj);
    return res;
  }, {} as any);
}

// 不完美的地方：k === "a"时应该限定返回值类型为number
/*pickByKeys({ a: 123, b: '111', c: false }, ['a', 'b'], (v, k, o) => {
  if (k === 'a') {
    return '123123';
  }
  return v;
});*/

/**
 * pick并且重命名
 *
 * 新属性名作为键名的好处是可以多个属性对应一个值
 *
 * @example
 *
 * const obj = { a: 1, b: '2', c: ['12313', 111], d: false, e: { a: 1 }, f: undefined };
 *
 * pickRename(obj, {}); // {}
 * pickRename(obj, { A: 'a' }); // { A: 1 }
 * pickRename(obj, { B: 'b' }); // { B: obj.b }
 * pickRename(obj, { C: 'c' }); // { C: obj.c }
 * pickRename(obj, { D: 'd' }); // { D: obj.d }
 * pickRename(obj, { E: 'e' }); // { E: obj.e }
 * // 不存在于对象中的属性会忽略
 * pickRename(obj, { G: 'G' as any }); // {}
 *
 * @param originObj 需要遍历的对象
 * @param pickKeyMap key map
 * @param cb 对值进行修改
 */
export function pickRename<T extends object, K extends keyof T, O extends { [k: string]: K }>(
  originObj: T,
  pickKeyMap: O,
  cb?: (value: T[O[keyof O]], key: O[keyof O], originObj: T) => T[O[keyof O]],
): { [k in keyof O]: T[O[k]] } {
  const callback = cb || ((v) => v);
  /* const renames = Object.keys(renamePickObj) as (keyof O)[];
     return renames.reduce((result, rename) => {
         const pick = renamePickObj[rename];
         if (originObj.hasOwnProperty(pick)) {
             result[rename] = callback(originObj[pick], pick, originObj);
         }
         return result;
     }, {} as any);*/
  return reduceObj(
    pickKeyMap,
    (result, pick, rename) => {
      if (hasOwn(originObj, pick)) {
        result[rename] = callback(originObj[pick], pick, originObj);
      }
      return result;
    },
    {} as any,
  );
}

/*
export function pickRename2<
  T extends object,
  K extends keyof T,
  O extends { [k: string]: K | ((t: T) => T[K]) },
>(originObj: T, renamePickObj: O): { [k in keyof O]: O[k] extends K ? T[O[k]] : T[K] } {
  return {} as any;
}

pickRename2(
  { a: 123, b: '222' },
  {
    c: 'a',
    d: (obj) => obj.a,
  },
);
*/

/**
 * pickByKeys与pickRename的合体函数
 *
 * @see pickByKeys
 *
 * @overload 通过key数组挑选,功能与pickByKeys函数一致
 *
 */
export function pick<T extends object, K extends keyof T, KS extends K[]>(
  originObj: T,
  pickKeys: KS,
  cb?: (value: T[K], key: K, fromObj: T) => T[K],
): { [key in K]: T[key] };
/**
 * pickByKeys与pickRename的合体函数
 *
 * @overload 通过key map挑选并重命名， 功能与pickRename函数一致
 *
 * @see pickRename
 */
export function pick<T extends object, K extends keyof T, O extends { [k: string]: K }>(
  originObj: T,
  pickKeyMap: O,
  cb?: (value: T[O[keyof O]], key: O[keyof O], fromObj: T) => T[O[keyof O]],
): { [k in keyof O]: T[O[k]] };
export function pick(originObj: object, picks: any[], cb?: Function) {
  const isObj = isObject(picks);
  // ------- 第一种写法 -------
  // const callback = cb || (v => v);
  // const pickKeys = isObj ? Object.keys(picks) : picks;
  // const getOriginObjKey = isObj ? k => picks[k] : k => k;
  // return pickKeys.reduce((res, k) => {
  //     const originObjKey = getOriginObjKey(k);
  //     if (originObj.hasOwnProperty(originObjKey)) {
  //         res[k] = callback(originObj[originObjKey], originObjKey, originObj);
  //     }
  //     return res;
  // }, {} as any);
  // ------- 第二种写法 -------
  // 更简洁 减少判断次数
  // TO DO 需要判断返回值类型是否改变了  改变则抛出异常
  return isObj
    ? pickRename(originObj, picks as any, cb as any)
    : pickByKeys(originObj, picks, cb as any);
}

// pick({a: 132, b: "123123"}, ["a", "b"]);

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
): { [k: string]: any } {
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

/**
 * 从其他对象中挑出与原对象中不存在的键值对所组成的新对象
 *
 * @overload 返回值支持ts类型推导
 *
 * @example
 *
 * pickExternal({ a: 1 }, { a: 2 }); // {}
 * pickExternal({ a: 1 }, { b: 2 }); // { b: 2 }
 * pickExternal({ a: 1 }, { b: 2, c: 3 }); // { b: 2, c: 3 }
 * pickExternal({ a: 1, b: 2 }, { b: 2, c: 3 }); // { c: 3 }
 *
 */
export function pickExternal<T extends object, K extends object>(
  origin: T,
  other: K,
): Omit<K, keyof T>;
/**
 * 从其他对象中挑出与原对象中不存在的键值对所组成的新对象
 *
 * @overload 返回值不支持ts类型推导, 返回的对象类型始终是 Record<string, any>
 *
 * pickExternal({ a: 1, b: 2 }, { b: 2, c: 3 }, { b: 2, c: 3 }); // { c: 3 }
 */
export function pickExternal(origin: object, ...others: object[]): Record<string, any>;
export function pickExternal(origin: object, ...others: object[]) {
  return pickDiff(origin, others, (_originV, _objV, k) => hasOwn(origin, k));
}

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
      forEachRight(objs, function (item: any): void | false {
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
