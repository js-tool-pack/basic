import { getStartOfMonth } from './getStartOfMonth';

/**
 * 判断是否是下个月
 *
 * @example
 *
 * const isNext = (date: string, base: string) => isNextMonth(parseFormattedDate(date), parseFormattedDate(base));
 *
 * isNext('2024-02', '2024-01'); // true
 * isNext('2024-01', '2023-12'); // true
 * isNext('2024-03', '2024-02'); // true
 * isNext('2024-01', '2024-12'); // false
 *
 * @param date 要判断的日期
 * @param relative 相对日期;默认为当前时间; 与 date 互换过来就是判断是否是上个月
 */
export function isNextMonth(date: Date, relative = new Date()): boolean {
  const d = getStartOfMonth(date, -1);
  return relative.getFullYear() === d.getFullYear() && d.getMonth() === relative.getMonth();
}
