/**
 * 安全数字
 *
 * 如果value小于min，那么返回min，如果value大于max，那么返回max，否则返回value
 *
 * @example
 *
 * getSafeNum(0); // 0
 * getSafeNum(0, 1, 100); // 1
 * getSafeNum(50, 1, 100); // 50
 * getSafeNum(101, 1, 100); // 100
 * getSafeNum(101, 1); // 101
 *
 * @param value 数字
 * @param [min=-Infinity] 默认-Infinity
 * @param [max=Infinity] 默认Infinity
 */
export function getSafeNum(value: number, min = -Infinity, max = Infinity): number {
  return Math.max(min, Math.min(value, max));
}
