import { isFunction } from '../../data-type';

/**
 * 添加元素到数组缝隙中
 *
 * 类似Array.prototype.join，
 * 与join合成string不同的是joinToArray是加入到数组中，
 * 该方法不对原数组操作
 *
 * @override separator为固定值
 *
 * @example
 *
 * joinArray([1, 2, 3], 0); // [1, 0, 2, 0, 3]
 * joinArray([1], 0); // [1]
 * joinArray([1, 2], 0); // [1, 0, 2]
 * joinArray<number | string>([1, 2, 3], 'a'); // [1, 'a', 2, 'a', 3]
 *
 */
export function joinArray<T>(arr: ArrayLike<T>, separator: T): T[];
/**
 * 添加元素到数组缝隙中
 *
 * 类似Array.prototype.join，
 * 与join合成string不同的是joinToArray是加入到数组中，
 * 该方法不对原数组操作
 *
 * @override separator为回调函数
 *
 * @example
 *
 * joinArray([1, 2, 3], (i) => i + 10); // [1, 11, 2, 13, 3]
 *
 */
export function joinArray<T>(arr: ArrayLike<T>, separator: (index: number) => T): T[];
export function joinArray(arr: ArrayLike<unknown>, separator: unknown): unknown[] {
  const len = arr.length;
  if (!len) return [];

  const res: unknown[] = [arr[0]];

  const cb = isFunction<(index: number) => unknown>(separator) ? separator : () => separator;
  for (let i = 1; i < len; i++) res.push(cb(res.length), arr[i]);

  return res;
}
