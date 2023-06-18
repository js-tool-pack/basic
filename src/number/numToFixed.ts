import { isNumber } from '../data-type';
import { inRange } from '../array';

/**
 * number保留小数位，原来的函数四舍五入不准确
 *
 * 原来的toFixed可以把科学计数法的小数，给转成普通小数字符串
 *
 * @example
 *
 * // Number.prototype.toFixed自带四舍五入
 * (0.45).toFixed(1); // '0.5'
 * // numToFixed默认使用四舍五入，跟Number.prototype.toFixed保持一致
 * numToFixed(0.45, 1); // '0.5'
 * // 关闭四舍五入
 * numToFixed(0.45, 1, false); // '0.4'
 *
 * @param num 原数字
 * @param [fractionDigits = 0] 保留小数位
 * @param [rounding = true] 是否四舍五入
 */
export function numToFixed(num: number, fractionDigits = 0, rounding = true): string {
  if (!isNumber(fractionDigits) || !inRange(fractionDigits, [0, 100])) {
    throw new TypeError('numToFixed() fractionDigits argument must be between 0 and 100');
  }
  if (fractionDigits === 0) return String(~~num);
  const base = 10;
  // 加1 四舍五入
  const pow = base ** (fractionDigits + 1);
  num = ~~(num * pow);
  if (rounding && num) {
    // num为0的时候位数已经不对了
    num += 5;
  }
  num /= pow;
  const split = String(num).split('.');
  const digits = (split[1] || '').substr(0, fractionDigits).padEnd(fractionDigits, '0');
  return split[0] + '.' + digits;
}
