/**
 * 获取某月最后一天的date
 *
 * @example
 *
 * getEndOfMonth(new Date('2021-1')).getDate(); // 31
 * getEndOfMonth(new Date('2021-2')).getDate(); // 28
 * getEndOfMonth(new Date('2021-3')).getDate(); // 31
 * getEndOfMonth(new Date('2021-4')).getDate(); // 30
 * getEndOfMonth(new Date('2021-5')).getDate(); // 31
 * getEndOfMonth(new Date('2021-6')).getDate(); // 30
 * getEndOfMonth(new Date('2021-7')).getDate(); // 31
 * getEndOfMonth(new Date('2021-8')).getDate(); // 31
 * getEndOfMonth(new Date('2021-9')).getDate(); // 30
 * getEndOfMonth(new Date('2021-10')).getDate(); // 31
 * getEndOfMonth(new Date('2021-11')).getDate(); // 30
 * getEndOfMonth(new Date('2021-12')).getDate(); // 31
 * getEndOfMonth(new Date('2020-2')).getDate(); // 29
 *
 */
export function getEndOfMonth(monthDate: Date): Date {
  const lastDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, monthDate.getDate());
  lastDate.setDate(0);
  return lastDate;
}
