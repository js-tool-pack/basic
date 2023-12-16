/**
 * @example
 *
 * // 2023-12-16
 * const date = new Date(2023, 11, 16);
 *
 * formatDate(dateAdd(date, 1, 'year')); // '2024-12-16 00:00:00'
 * formatDate(dateAdd(date, -1, 'year')); // '2022-12-16 00:00:00'
 * formatDate(dateAdd(date, 1, 'month')); // '2024-01-16 00:00:00'
 * formatDate(dateAdd(date, -1, 'month')); // '2023-11-16 00:00:00'
 * formatDate(dateAdd(date, 1, 'week')); // '2023-12-23 00:00:00'
 * formatDate(dateAdd(date, -1, 'week')); // '2023-12-09 00:00:00'
 * formatDate(dateAdd(date, 1, 'date')); // '2023-12-17 00:00:00'
 * formatDate(dateAdd(date, -1, 'date')); // '2023-12-15 00:00:00'
 * formatDate(dateAdd(date, 1)); // '2023-12-17 00:00:00'
 * formatDate(dateAdd(date, 1, 'hours')); // '2023-12-16 01:00:00'
 * formatDate(dateAdd(date, -1, 'hours')); // '2023-12-15 23:00:00'
 * formatDate(dateAdd(date, 1, 'minutes')); // '2023-12-16 00:01:00'
 * formatDate(dateAdd(date, -1, 'minutes')); // '2023-12-15 23:59:00'
 * formatDate(dateAdd(date, 1, 'seconds')); // '2023-12-16 00:00:01'
 * formatDate(dateAdd(date, -1, 'seconds')); // '2023-12-15 23:59:59'
 * formatDate(dateAdd(date, 1000, 'milliseconds')); // '2023-12-16 00:00:01'
 * formatDate(dateAdd(date, -1000, 'milliseconds')); // '2023-12-15 23:59:59'
 *
 * @param date
 * @param addValue
 * @param [type='date']
 */
export function dateAdd(
  date: Date,
  addValue: number,
  type:
    | 'date'
    | 'month'
    | 'year'
    | 'week'
    | 'hours'
    | 'minutes'
    | 'seconds'
    | 'milliseconds' = 'date',
): Date {
  const result = new Date(date);

  const map: Record<typeof type, () => void> = {
    year: () => result.setFullYear(result.getFullYear() + addValue),
    month: () => result.setMonth(result.getMonth() + addValue),
    week: () => result.setDate(result.getDate() + addValue * 7),
    date: () => result.setDate(result.getDate() + addValue),
    hours: () => result.setHours(result.getHours() + addValue),
    minutes: () => result.setMinutes(result.getMinutes() + addValue),
    seconds: () => result.setSeconds(result.getSeconds() + addValue),
    milliseconds: () => result.setMilliseconds(result.getMilliseconds() + addValue),
  };
  map[type]();

  return result;
}
