import { formatDate } from './formatDate';

/**
 * 判断时间是否相同
 *
 * @example
 *
 * const date = new Date('2021-10-10');
 * const date2 = new Date('2021-10-30');
 *
 * isSameTime('yyyy-MM', date, date2); // true
 * isSameTime('yyyy-MM-dd', date, date2); // false
 * isSameTime('yyyy hh:mm:ss', date, date2); // true
 *
 * @param format yyyy-MM-dd hh:mm:ss
 * @param date
 * @param dates
 */
export function isSameTime(format: string, date: Date, ...dates: Date[]): boolean {
  const dt = formatDate(date, format);
  return dates.every((date) => formatDate(date, format) === dt);
}
