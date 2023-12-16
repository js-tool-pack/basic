/**
 * 获取日期前一个月最后一天的date
 *
 * @example
 *
 * getEndOfPrevMonth(new Date('2021-1')).getDate(); // 31
 * getEndOfPrevMonth(new Date('2021-2')).getDate(); // 31
 * getEndOfPrevMonth(new Date('2021-3')).getDate(); // 28
 * getEndOfPrevMonth(new Date('2021-4')).getDate(); // 31
 * getEndOfPrevMonth(new Date('2021-5')).getDate(); // 30
 * getEndOfPrevMonth(new Date('2021-6')).getDate(); // 31
 * getEndOfPrevMonth(new Date('2021-7')).getDate(); // 30
 * getEndOfPrevMonth(new Date('2021-8')).getDate(); // 31
 * getEndOfPrevMonth(new Date('2021-9')).getDate(); // 31
 * getEndOfPrevMonth(new Date('2021-10')).getDate(); // 30
 * getEndOfPrevMonth(new Date('2021-11')).getDate(); // 31
 * getEndOfPrevMonth(new Date('2021-12')).getDate(); // 30
 *
 */
export function getEndOfPrevMonth(monthDate: Date): Date {
  return new Date(monthDate.getFullYear(), monthDate.getMonth(), 0);
}
