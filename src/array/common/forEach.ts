// 注意：写成下面这种方式(把ArrayLike<T>提取到范型A):
// function forEach<T, A extends ArrayLike<T>>(
//   arr: A,
//   callbackFn: (value: T, index: number, array: A) => any | false,
//   elseCB?: () => void,
// ): boolean
// 在使用时回调函数的value是不会有类型推导的，value类型将是 unknown

// ie9支持
// forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
/**
 * 遍历数组，并不完全等同 Array.prototype.forEach，该forEach支持中断，支持类似Python的for else功能
 *
 * Python的for else hack写法
 *
 * ```ts
 * try {
 *   [1, 2, 3, 4, 5].forEach((item, index) => {
 *     \/* do something *\/
 *     if (index === 2 && item === 3) {
 *       // break;
 *       throw new Error('break');
 *     }
 *   });
 *   \/* do else *\/
 * } catch (e: any) {
 *   if (e.message !== 'break') throw e;
 * }
 * ```
 *
 * @example
 * const arr1 = [1, 2, 3];
 * let isDone = forEach(arr1, (_v, k) => (arr1[k] = k));
 * isEqual(arr1, [0, 1, 2]); // true
 * isDone; // true
 *
 * // ArrayLike
 * isDone = forEach({ 0: 1, 1: 2, length: 2 }, (_v, k) => (arr1[k] = k + k));
 * isEqual(arr1, [0, 2, 2]); // true
 * isDone; // true
 *
 * isDone = forEach(arr1, (_v, k) => {
 *   arr1[k] = k + 1;
 *   return k !== 1;
 * });
 * isDone; // false
 * isEqual(arr1, [1, 2, 2]); // true
 *
 * let elseCount = 0;
 * isDone = forEach(
 *   arr2,
 *   (v, k) => (arr2[k] = 'a' + v),
 *   () => elseCount++, // 完整遍历以后会执行该方法
 * );
 * isDone; // true
 * elseCount; // 1
 *
 * @param arr 数组
 * @param callbackFn 该回调如果返回false则会中断遍历
 * @param elseCB 类似于Python的for else中的else，
 *        只会在完整的遍历后执行，如果break则不会触发
 * @returns {boolean} isDone 是否遍历完成
 */
export function forEach<T>(
  arr: ArrayLike<T>,
  callbackFn: (value: T, index: number, array: ArrayLike<T>) => false | any,
  elseCB?: () => void,
): boolean {
  // 不能直接把arr.length放进循环，否则在循环里新增的话length会变长,原生的不会变长
  const len = arr.length || 0;
  // if (!isArrayLike(arr)) throw new TypeError();
  for (let i = 0; i < len; i++) {
    if (callbackFn(arr[i] as T, i, arr) === false) return false;
  }
  elseCB && elseCB();
  return true;
}
