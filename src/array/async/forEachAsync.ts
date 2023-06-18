/**
 * forEach异步回调版
 *
 * 跟promiseQueue类似，不过此函数是callback异步，重点在callback
 *
 * @param arr
 * @param cbAsync 异步回调
 */
export async function forEachAsync<T>(
  arr: ArrayLike<T>,
  cbAsync: (value: T, index: number, array: ArrayLike<T>) => Promise<any | false>,
): Promise<void> {
  // 不能直接把arr.length放进循环，否则在循环里新增的话length会变长,原生的不会变长
  const len = arr.length;
  // if (!isArrayLike(arr)) throw new TypeError();
  for (let i = 0; i < len; i++) {
    const v = await cbAsync(arr[i] as T, i, arr);
    if (v === false) break;
  }
}
