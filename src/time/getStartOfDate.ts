/**
 * 获取某一天的开始Date
 *
 * @example
 *
 * ```typescript
 * formatDate(getStartOfDate(new Date('2023/04/19 12:10:50'))); // '2023-04-19 00:00:00'
 * ```
 */
export function getStartOfDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
