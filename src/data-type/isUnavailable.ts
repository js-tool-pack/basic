/**
 * 是否是不可用的值
 *
 * "不可用的值"指的是null ｜ undefined ｜ NaN
 *
 *
 * @param value
 */
export function isUnavailable(value: unknown): boolean {
  return [undefined, null, NaN].includes(value as any);
}
