/**
 * 获取某日所属月的 1 号
 *
 * @example
 *
 * const getStart = (date: string) => formatDate(getStartOfMonth(parseFormattedDate(date)));
 * getStart('2023-01-11 19:25:00'); // '2023-01-01 00:00:00'
 * getStart('2023-10-01 12:25:00'); // '2023-10-01 00:00:00'
 * getStart('2023-12-30 02:25:00'); // '2023-12-01 00:00:00'
 */
export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
