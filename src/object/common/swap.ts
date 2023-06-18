/**
 * 对象或数组key交换
 *
 * @example
 *
 * // 对象属性交换
 * swap({ a: 1, b: 2 }, 'a', 'b'); // { b: 1, a: 2 }
 * swap({ a: 1, b: 2 }, 'a', 'c' as any); // { c: 1, b: 2, a: undefined }
 * // 数组item交换
 * swap([1, 2], 1, 0); // [2, 1]
 * swap([1, 2], 1, 2); // [1, undefined, 2]
 */
export function swap<T extends object, K1 extends keyof T, K2 extends keyof T>(
  obj: T,
  k1: K1,
  k2: K2,
): T {
  const temp = obj[k1];
  obj[k1] = obj[k2] as any;
  obj[k2] = temp as any;
  return obj;
}
