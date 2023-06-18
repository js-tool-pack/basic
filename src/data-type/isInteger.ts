/**
 * 判断数字是否整数
 *
 * 跟 es6 的 Number.isInteger一致，推荐直接使用 Number.isInteger
 *
 * 判定方式：value % 1 === 0
 * @example
 *
 * isInteger(1); // true
 * isInteger(Number.MAX_SAFE_INTEGER); // true
 * isInteger(Number.MIN_SAFE_INTEGER); // true
 * isInteger(0); // true
 * isInteger(-0); // true
 * isInteger(0.1); // false
 * isInteger(-0.1); // false
 * isInteger(-1.1); // false
 * isInteger(NaN); // false
 * isInteger(Infinity); // false
 */
export function isInteger(value: number): boolean {
  return value % 1 === 0;
}
