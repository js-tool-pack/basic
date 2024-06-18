/**
 * forEach的反向遍历版本
 *
 * @example
 *
 * const arr: number[] = [];
 * forEachRight([1, 2, 3, 4], (i) => arr.push(i + 1));
 * isEqual(arr, [5, 4, 3, 2]); // true
 *
 * const result: any = {};
 * forEachRight(createArray({ len: 20 }), (v, k) => {
 *   result[k] = v;
 *   if (k === 10) return false;
 *   return;
 * });
 * isEqual(result,
 *   createArray({ start: 10, end: 20 }).reduce((obj, v) => {
 *     obj[v] = v;
 *     return obj;
 *   }, {} as Record<string, any>),
 * )); // true
 *
 * const result2: any[] = [];
 * forEachRight(createArray({ len: 20 }), (v, k) => {
 *   result2.push({ [k]: v });
 *   if (k === 15) return false;
 *   return;
 * });
 *
 * isEqual(result2, [{ 19: 19 }, { 18: 18 }, { 17: 17 }, { 16: 16 }, { 15: 15 }]); // true
 *
 * let elseCount = 0;
 * const isDone = forEachRight(
 *   arr,
 *   () => {},
 *   () => elseCount++, // 完整遍历以后会执行该方法
 * );
 * isDone; // true
 * elseCount; // 1
 */
export function forEachRight<T>(
  arr: ArrayLike<T>,
  callbackFn: (value: T, index: number, array: ArrayLike<T>) => false | any,
  elseCB?: () => void,
): boolean {
  for (let i = arr.length - 1; i > -1; i--) {
    if (callbackFn(arr[i] as T, i, arr) === false) return false;
  }
  elseCB && elseCB();
  return true;
}
