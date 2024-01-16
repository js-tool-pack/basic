/**
 * 判断两个日期是否是同一天
 *
 * 当两个日期的年月日一致时为同一天
 *
 * @example
 *
 * const isSame = (date1: string, date2?: string) => isSameDate(parseFormattedDate(date1), date2 ? parseFormattedDate(date2) : undefined);
 *
 * isSame('2024-01-17', '2024-01-17'); // true
 * isSame('2024-01-17 00:00:00', '2024-01-17 12:00:00'); // true
 * isSame('2024-01-17', '2024-02-17'); // false
 * isSame('2024-01-17', '2023-12-17'); // false
 * isSame('2024-01-17'); // false
 *
 */
export function isSameDate(date1: Date, date2?: Date): boolean {
  if (!date2) return false;
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
