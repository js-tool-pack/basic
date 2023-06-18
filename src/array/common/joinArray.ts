/**
 * 添加元素到数组缝隙中
 *
 * 类似Array.prototype.join，
 * 与join合成string不同的是joinToArray是加入到数组中，
 * 该方法不对原数组操作
 *
 * @example
 *
 * joinArray([1, 2, 3], 0); // [1, 0, 2, 0, 3]
 * joinArray([1], 0); // [1]
 * joinArray([1, 2], 0); // [1, 0, 2]
 * joinArray<number | string>([1, 2, 3], 'a'); // [1, 'a', 2, 'a', 3]
 *
 */
export function joinArray<T>(arr: ArrayLike<T>, separator: T): T[] {
  const len = arr.length;
  if (!len) return [];

  const res: T[] = [arr[0] as T];
  for (let i = 1; i < len; i++) res.push(separator, arr[i] as T);

  return res;
}
