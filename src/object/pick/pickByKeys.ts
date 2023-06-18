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
    res[key] = callback(originObj[key], key, originObj);
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
