import { createArray } from '../array';

/**
 * min end都不传 返回范围：0 - Number.MAX_SAFE_INTEGER
 *
 * @example
 *
 * randomFloat(); // 生成0-Number.MAX_SAFE_INTEGER之间的整数
 */
export function randomInt(): number;
/**
 * min = 0 生成0-max之间的随机数，不包含max
 *
 * @example
 *
 * randomInt(10); // 生成0-10之间的整数
 */
export function randomInt(max: number): number;
/**
 * 生成min到max之间的随机数 包含min不包含max
 *
 * @example
 *
 * randomInt(2,10); // 生成2-10之间的整数
 */
export function randomInt(min: number, max: number): number;
/**
 * 生成min到max之间的随机数组 包含min不包含max len：数组长度
 *
 * @example
 *
 * randomInt(5,10,7); // 生成长度为7的整数数组，每个成员范围为5-10之间
 */
export function randomInt(min: number, max: number, len: number): number[];
export function randomInt(min?: number, max?: number, len?: number): number | number[] {
  // randomInt()
  if (!arguments.length) return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  let _min = min as number;
  let _max = max as number;
  // randomInt(max)
  if (arguments.length === 1) {
    _max = _min;
    _min = 0;
  }
  if (len === undefined) {
    const dif = _max - _min;
    // 直接调用randomFloat的话randomInt(-10,10)永远都不会出现-10
    // 用~~做整数转换的时候，数字太大会变为负数: 如1000 * 60 * 60 * 24 * 30
    //  return ~~(Math.random() * dif) + (min as number);
    return Math.floor(Math.random() * dif) + _min;
  }
  return createArray({
    len,
    fill: () => randomInt(_min, _max),
  });
}
