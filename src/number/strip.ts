/**
 * 把错误的数据转正  from number-precision
 *
 * @example
 *
 * 1.0000000000041083; // 1.0000000000041083
 * strip(1.0000000000041083); // 1
 *
 * 1.0000000000001563; // 1.0000000000001563
 * strip(1.0000000000001563); // 1
 *
 * 1.0000000000001563; // 1.0000000000001563
 * strip(1.0000000000001563); // 1
 *
 * strip(0.09999999999999998); // 0.1
 *
 */
export function strip(num: number, precision = 12): number {
  return +parseFloat(num.toPrecision(precision));
}
