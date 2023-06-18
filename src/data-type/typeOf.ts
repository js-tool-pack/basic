/**
 * 获取数据类型
 *
 * @example
 * // 六大基本类型 string boolean number object null undefined
 * typeOf(''); // 'string'
 * typeOf(true); // 'boolean'
 * typeOf(0); // 'number'
 * typeOf(undefined); // 'undefined'
 * typeOf({}); // 'object'
 * typeOf(null); // 'null'
 * // 非6
 * typeOf(() => {}); // 'function'
 * typeOf([]); // 'array'
 * typeOf(NaN); // 'number'
 * typeOf(/abc/); // 'regexp'
 *
 */
export function typeOf(target: unknown): string {
  const tp = typeof target;
  if (tp !== 'object') return tp;
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}
