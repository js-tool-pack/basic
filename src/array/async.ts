/**
 * 跟promiseQueue类似，不过此函数是callback异步，重点在callback
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
export async function mapAsync<T, R>(
  arr: ArrayLike<T>,
  cbAsync: (value: T, index: number, array: ArrayLike<T>) => Promise<R>,
): Promise<R[]> {
  const result: any[] = [];
  await forEachAsync(arr, async (v: T, k, a) => {
    const item = await cbAsync(v, k, a);
    result.push(item);
  });
  return result;
}
/**
 * reduce promise 跟 promiseQueue差不多，此函数多了callbackFn
 * @param arr 如果数组中的某一项返回的是false，那么会中断遍历
 * @param callbackFn
 * @param initValue
 */
export async function reduceAsync<T, I = T>(
  arr: ArrayLike<T>,
  callbackFn: (initValue: I, value: T, index: number, array: ArrayLike<T>) => Promise<I>,
  initValue: I,
): Promise<I>;
export async function reduceAsync<T extends (...args: any[]) => Promise<any>>(
  arr: ArrayLike<T>,
  callbackFn: (
    initValue: Awaited<ReturnType<T>>,
    item: T,
    index: number,
    array: ArrayLike<T>,
  ) => Promise<Awaited<ReturnType<T>>>,
): Promise<Awaited<ReturnType<T>>>;
export async function reduceAsync<T extends (...args: any[]) => any>(
  arr: ArrayLike<T>,
  callbackFn: (
    initValue: ReturnType<T>,
    item: T,
    index: number,
    array: ArrayLike<T>,
  ) => ReturnType<T>,
): Promise<ReturnType<T>>;
export async function reduceAsync(
  arr: ArrayLike<any>,
  callbackFn: (
    initValue: unknown,
    item: unknown,
    index: number,
    array: ArrayLike<unknown>,
  ) => Promise<unknown>,
  initValue?: unknown,
): Promise<unknown> {
  const len = arr.length;

  if (!len) {
    if (initValue === void 0) throw new Error('Reduce of empty array with no initial value');
    return Promise.resolve(initValue);
  }

  let previousValue: unknown = initValue ?? (await arr[0]());

  for (let i = initValue ? 0 : 1; i < len; i++) {
    const item = arr[i];
    const curValue = await callbackFn(previousValue, item, i, arr);
    if (curValue === false) break;
    previousValue = curValue;
  }

  return previousValue;
}
