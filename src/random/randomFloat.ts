import { createArray } from '../array';

/**
 * min end都不传  return Math.random()
 *
 * @example
 *
 * randomFloat(); // 生成0-1之间的浮点数
 *
 */
export function randomFloat(): number;
/**
 * 生成0-max之间的随机数, min = 0，不包含max
 *
 * @example
 *
 * randomFloat(10); // 生成0-10之间的浮点数
 */
export function randomFloat(max: number): number;
/**
 * 生成min到max之间的随机数 包含min不包含max
 *
 * @example
 *
 * randomFloat(2, 10); // 生成2-10之间的浮点数
 */
export function randomFloat(min: number, max: number): number;
/**
 * 生成min到max之间的随机数组 包含min不包含max, len：数组长度
 *
 * @example
 *
 * randomFloat(2, 8, 10); // 生成长度为10的随机数组，每个成员的范围是2-8
 *
 */
export function randomFloat(min: number, max: number, len: number): number[];
/**
 * 生成随机浮点数
 */
export function randomFloat(min?: number, max?: number, len?: number): number[] | number {
  // randomFloat()
  if (!arguments.length) return Math.random();
  let _min = min as number;
  let _max = max as number;

  // randomFloat(max)
  if (arguments.length === 1) {
    _max = _min;
    _min = 0;
  }

  // randomFloat(min, max)
  if (len === undefined) {
    const dif = _max - _min;
    return Math.random() * dif + _min;
  }
  return createArray({
    fill: () => randomFloat(_min, _max),
    len,
  });
}
