/**
 * 判断min <= num <= max
 *
 * @example
 *
 * inRange(0, [undefined as any, 100]); // true
 * inRange(0, [0]); // true
 * inRange(0, [1]); // false
 * inRange(0, [1, 2]); // false
 *
 * @param value
 * @param [min = Number.MIN_SAFE_INTEGER]
 * @param [max = Number.MAX_SAFE_INTEGER]
 */
export function inRange(
  value: number,
  [min = -Infinity, max = Infinity]: readonly [number?, number?],
): boolean {
  return min <= value && value <= max;
}
