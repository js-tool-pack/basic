import { getEndOfMonth } from './getEndOfMonth';

/**
 * 计算两个日期间相差的年数 a - b
 *
 * @example
 *
 * yearDiff(new Date('2022-07-01'), new Date('2020-7-1')); // 2
 * yearDiff(new Date('2022-07-02'), new Date('2020-7-1')); // 2.002
 * yearDiff(new Date('2022-07-01'), new Date('2022-1-1')); // 0.5
 * yearDiff(new Date('2022-1-1'), new Date('2022-07-01')); // -0.5
 * yearDiff(new Date('2022-1-30'), new Date('2022-01-31')); // -0.002
 *
 * @param a
 * @param b
 * @returns {number}
 */
export function yearDiff(a: Date, b: Date): number {
  let months = a.getMonth() - b.getMonth();
  const years = a.getFullYear() - b.getFullYear();
  months += years * 12;
  const dates = a.getDate() - b.getDate();
  months += ~~((dates * 100) / (getEndOfMonth(a).getDate() - 1)) / 100;
  return ~~((months * 1000) / 12) / 1000;
}
