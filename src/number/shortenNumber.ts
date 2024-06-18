import { toNonExponential } from './toNonExponential';

export type NUMBER_UNIT = 'Y' | 'Z' | 'E' | 'P' | 'T' | 'G' | 'M' | 'K';

/**
 * 缩短数字
 *
 * @example
 *
 * const fn = Num.shortenNumber;
 * const k = 1000;
 *
 * fn(k); // '1K'
 * fn(k * k); // '1M'
 * fn(k * k * k); // '1G'
 * fn(k * k * k * k); // '1T'
 * fn(k * k * k * k * k); // '1P'
 * fn(k ** 6); // '1E'
 * fn(k ** 7); // '1Z'
 * fn(-(k ** 7)); // '-1Z'
 * fn(k ** 8); // '1Y'
 *
 * // 指定单位
 * fn(k * 0.5 * k, { unit: 'M' }); // '0.5M'
 * fn(k * 0.5 * k, { unit: 'G' }); // '0G'
 * // 指定小数位
 * fn(k * 0.49 * k, { unit: 'G', fractionDigits: 5 }); // '0.00049G'
 * fn(1, { unit: 'G', fractionDigits: 9 }); // '0.000000001G'
 * // 使用科学计数法
 * fn(1, { unit: 'G', fractionDigits: 9, exponential: true }); // '1e-9G'
 *
 * // 包括单位，长度超过 5 位单位才进位
 * fn(100, { maxLength: 5 }); // '100'
 * fn(100_00, { maxLength: 5 }); // '10000'
 * fn(100_000, { maxLength: 5 }); // '100K'
 * fn(1_000_000, { maxLength: 5 }); // '1000K'
 * fn(10_000_000, { maxLength: 5 }); // '10M'
 * fn(100_000_000, { maxLength: 5 }); // '100M'
 * fn(1_000_000_000, { maxLength: 5 }); // '1000M'
 * fn(10_000_000_000, { maxLength: 5 }); // '10G'
 * fn(1_000_000_000_000, { maxLength: 5 }); // '1000G'
 * fn(10_000_000_000_000, { maxLength: 5 }); // '10T'
 * fn(100_000_000_000_000, { maxLength: 5 }); // '100T'
 * fn(1_000_000_000_000_000, { maxLength: 5 }); // '1000T'
 * fn(100_000_000_000_000_000, { maxLength: 5 }); // '100P'
 * fn(1_000_000_000_000_000_000_000, { maxLength: 5 }); // '1000E'
 * fn(1_000_000_000_000_000_000_000_000, { maxLength: 5 }); // '1000Z'
 * fn(1_000_000_000_000_000_000_000_000_000, { maxLength: 5 }); // '1000Y'
 * // 最大单位为 Y
 * fn(1_000_000_000_000_000_000_000_000_000_000, { maxLength: 5, exponential: true }); // '1e+6Y'
 *
 * // 指定1k=1024
 * const kb = 1024;
 * fn(kb * 0.5 * kb, { kSize: kb }); // '512K'
 * fn(kb * 0.5 * kb, { kSize: kb, unit: 'M' }); // '0.5M'
 * fn(kb * 50 * kb, { kSize: kb, unit: 'K' }); // '51200K'
 *
 * @param value 数值
 * @param {{}} options 选项
 * @param options.kSize 1k 的大小；默认为 1000
 * @param options.unit 指定单位
 * @param [options.fractionDigits=2] 指定小数位；默认2
 * @param [options.maxLength=3] 指定数字长度大于多少才进单位，类似战力游戏中的战斗力数值展示，必须大于 3 才有效，因为千分位本来就是三位；默认为 3
 * @param [options.exponential=false] 是否使用科学计数法；默认false
 */
export function shortenNumber(
  value: number,
  options: {
    /**
     * 小数位；默认2
     */
    fractionDigits?: number;
    /**
     * 使用科学计数法
     */
    exponential?: boolean;
    /**
     * 数字长度大于多少才进单位；默认为 3
     */
    maxLength?: number;
    /**
     * 单位
     */
    unit?: NUMBER_UNIT;
    /**
     * 1k 的大小；默认为 1000
     */
    kSize?: number;
  } = {},
): string {
  const { exponential = false, fractionDigits = 2, maxLength = 3, kSize = 1000, unit } = options;

  const k = kSize;
  const m = k ** 2;
  const g = k ** 3;
  const t = k ** 4;
  const p = k ** 5;
  const e = k ** 6;
  const z = k ** 7;
  const y = k ** 8;

  const rangeMap: [number, NUMBER_UNIT | ''][] = [
    [y, 'Y'],
    [z, 'Z'],
    [e, 'E'],
    [p, 'P'],
    [t, 'T'],
    [g, 'G'],
    [m, 'M'],
    [k, 'K'],
    [0, ''],
  ];

  type Handler = (item: [number, NUMBER_UNIT | ''], index: number) => boolean;
  const handleUnit: Handler = ([, u]) => u === unit;
  const handleRange = (): Handler => {
    const absValue = Math.abs(value);
    return ([range]) => absValue >= range;
  };
  const handleMaxLimitRange = (): Handler => {
    const absValue = Math.abs(value);
    const limit = 10 ** (maxLength - 1);
    const end = rangeMap.length - 1;
    return ([range], index) => {
      if (index === end) return true;
      if (absValue < range) return false;
      if (absValue <= limit) return true;
      return absValue / (range || 1) < limit;
    };
  };

  // 反过来查找
  if (maxLength > 3) rangeMap.reverse();

  const handler: Handler = unit
    ? handleUnit
    : maxLength > 3
      ? handleMaxLimitRange()
      : handleRange();

  const [range, _unit] = rangeMap.find(handler)!;
  const result = Number((value / (range || 1)).toFixed(fractionDigits));
  return (exponential ? result.toExponential() : toNonExponential(result)) + _unit;
}
