import { forEachAsync } from './forEachAsync';

/**
 * map异步回调版
 *
 * @example
 *
 * const asyncList = [
 *   async () => {
 *     await sleep(200);
 *     return 1;
 *   },
 *   async () => {
 *     await sleep(300);
 *     return 2;
 *   },
 *   async () => {
 *     await sleep(10);
 *     return 3;
 *   },
 * ];
 * const res = await fn(asyncList, (v) => v());
 * console.log(res); // [1, 2, 3]
 *
 */
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
