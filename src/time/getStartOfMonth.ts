/**
 * 获取某日所属月的 1 号
 *
 * @example
 *
 *  const getStart = (date: string, offset = 0) => formatDate(getStartOfMonth(parseFormattedDate(date), offset));
 * getStart('2023-01-11 19:25:00'); // '2023-01-01 00:00:00'
 * getStart('2023-10-01 12:25:00'); // '2023-10-01 00:00:00'
 * getStart('2023-12-30 02:25:00'); // '2023-12-01 00:00:00'
 * // 月份偏移
 * getStart('2023-12-30 02:25:00', 1); // '2024-01-01 00:00:00'
 * getStart('2023-12-30 02:25:00', -1); // '2023-11-01 00:00:00'
 */
export function getStartOfMonth(date: Date, offset = 0): Date {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}
