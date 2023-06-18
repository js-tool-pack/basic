import { isFunction } from '../../data-type';

/**
 * 添加元素到数组缝隙中
 *
 * 类似Array.prototype.join，
 * 与join合成string不同的是joinToArray是加入到数组中，
 * 该方法不对原数组操作
 *
 * @override ## separator为固定值
 *
 * @example
 *
 * joinArray([1, 2, 3], 0); // [1, 0, 2, 0, 3]
 * joinArray([1], 0); // [1]
 * joinArray([1, 2], 0); // [1, 0, 2]
 * joinArray<number | string>([1, 2, 3], 'a'); // [1, 'a', 2, 'a', 3]
 *
 */
export function joinArray<T>(
  arr: ArrayLike<T>,
  separator: T,
  callbackFn?: (item: T, index: number) => T,
): T[];
/**
 * @override ## separator为回调函数
 *
 * @example
 *
 * joinArray([1, 2, 3], (i) => i + 10); // [1, 11, 2, 13, 3]
 *
 */
export function joinArray<T>(
  arr: ArrayLike<T>,
  getSeparator: (index: number) => T,
  callbackFn?: (item: T, index: number) => T,
): T[];
export function joinArray(
  arr: ArrayLike<unknown>,
  separator: unknown,
  callbackFn: (item: unknown, index: number) => unknown = (it) => it,
): unknown[] {
  const len = arr.length;
  if (!len) return [];

  const res: unknown[] = [callbackFn(arr[0], 0)];

  const cb = isFunction<(index: number) => unknown>(separator) ? separator : () => separator;
  for (let i = 1; i < len; i++) {
    const index = res.length;
    res.push(cb(index), callbackFn(arr[i], index + 1));
  }

  return res;
}
