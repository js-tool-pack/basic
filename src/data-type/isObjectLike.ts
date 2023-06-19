/**
 * 判断是否类对象(object like)|广义上的对象, 包含Array,Function
 *
 * @alias isBroadlyObj
 *
 * @example
 *
 * isObjectLike([1, 2, 3]); // true
 * isObjectLike([]); // true
 * isObjectLike('1'); // false
 * isObjectLike(1); // false
 * isObjectLike(true); // false
 * isObjectLike(undefined); // false
 * isObjectLike(null); // false
 * isObjectLike({}); // true
 * isObjectLike(() => {}); // true
 *
 */
export function isObjectLike<T extends object = object>(value: unknown): value is T {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
}
