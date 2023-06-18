import { forEachObj } from '../iterate';
import { hasOwn } from './hasOwn';

/**
 * 根据新键值对重命名对象的key，并生成一个新的对象
 *
 * 跟pickRename类似，但不会pick，未改动的会原样返回
 *
 * @example
 *
 * renameObjKey({ a: 12, b: undefined, c: 3 }, { test: 'a', bb: 'b' }); // { test: 12,bb: undefined, c: 3, }
 * renameObjKey({ a: 12, b: undefined, c: 3 }, { test: 'aa' as any, bb: 'b' }); // { a: 12, bb: undefined, c: 3, }
 * renameObjKey({ a: 1, b: 2 }, { a: 'a', aa: 'a', aaa: 'a' }); // { a: 1, aa: 1, aaa: 1, b: 2, }
 */
export function renameObjKey<
  T extends object,
  K extends keyof T,
  O extends {
    [k: string]: K;
  },
  R extends Omit<T, O[keyof O]>,
>(originObj: T, keyMap: O): { [k in keyof O]: T[O[k]] } & R {
  const result: any = Object.assign({}, originObj);
  const delKeys: K[] = [];
  const newKeys: string[] = [];
  forEachObj(keyMap, (originKey, k) => {
    if (hasOwn(result, originKey)) {
      result[k] = result[originKey];
      delKeys.push(originKey);
      newKeys.push(k as string);
    }
  });

  // 可能新key会与旧key同名，如果是同名则把该key从要删除的key数组中移除
  // delKeys = delKeys.filter(k => newKeys.indexOf(k as string) === -1);

  delKeys.forEach((k) => {
    if (newKeys.indexOf(k as string) > -1) return;
    delete result[k];
  });
  return result;
}
