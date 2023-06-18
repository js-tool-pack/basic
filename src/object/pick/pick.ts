import { isObject } from '../../data-type';
import { pickRename } from './pickRename';
import { pickByKeys } from './pickByKeys';

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
export function pick<
  T extends object,
  K extends keyof T,
  O extends {
    [k: string]: K;
  },
>(
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
