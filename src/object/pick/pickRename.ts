import { reduceObj } from '../iterate';

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
export function pickRename<
  T extends object,
  K extends keyof T,
  O extends {
    [k: string]: K;
  },
>(
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
      result[rename] = callback(originObj[pick], pick, originObj);
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
