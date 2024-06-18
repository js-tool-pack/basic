import { isObject } from '../data-type';
import { forEachObj } from '../object';

type AddType =
  | 'milliseconds'
  | 'minutes'
  | 'seconds'
  | 'month'
  | 'hours'
  | 'date'
  | 'year'
  | 'week';

/**
 * @example
 *
 * // 2023-12-16
 * const date = new Date(2023, 11, 16);
 *
 * // 第二个参数为 number，添加单项
 * formatDate(dateAdd(date, 1, 'year')); // '2024-12-16 00:00:00'
 * formatDate(dateAdd(date, -1, 'year')); // '2022-12-16 00:00:00'
 * formatDate(dateAdd(date, 1, 'month')); // '2024-01-16 00:00:00'
 * formatDate(dateAdd(date, -1, 'month')); // '2023-11-16 00:00:00'
 * formatDate(dateAdd(date, 1, 'week')); // '2023-12-23 00:00:00'
 * formatDate(dateAdd(date, -1, 'week')); // '2023-12-09 00:00:00'
 * formatDate(dateAdd(date, 1, 'date')); // '2023-12-17 00:00:00'
 * formatDate(dateAdd(date, -1, 'date')); // '2023-12-15 00:00:00'
 * // type 默认为 'date'
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
 * // 第二个参数为 object，添加多项
 * formatDate(dateAdd(date, { year: 1 })); // '2024-12-16 00:00:00'
 * const add = {
 *   year: 1,
 *   month: 1,
 *   week: 1,
 *   date: 1,
 *   hours: -1,
 *   minutes: 1,
 *   seconds: 1,
 *   milliseconds: -1000,
 * };
 * formatDate(dateAdd(date, add)); // '2025-01-23 23:01:00'
 *
 */
export function dateAdd(date: Date, addValue: number, type?: AddType): Date;
export function dateAdd(date: Date, add: Partial<Record<AddType, number>>): Date;
export function dateAdd(
  date: Date,
  add: Partial<Record<AddType, number>> | number,
  type: AddType = 'date',
): Date {
  const result = new Date(date);

  const map: Record<AddType, (addValue: number) => void> = {
    milliseconds: (addValue) => result.setMilliseconds(result.getMilliseconds() + addValue),
    minutes: (addValue) => result.setMinutes(result.getMinutes() + addValue),
    seconds: (addValue) => result.setSeconds(result.getSeconds() + addValue),
    year: (addValue) => result.setFullYear(result.getFullYear() + addValue),
    week: (addValue) => result.setDate(result.getDate() + addValue * 7),
    month: (addValue) => result.setMonth(result.getMonth() + addValue),
    hours: (addValue) => result.setHours(result.getHours() + addValue),
    date: (addValue) => result.setDate(result.getDate() + addValue),
  };

  if (isObject(add)) {
    forEachObj(add, (v, k) => {
      map[k]?.(v as number);
    });
  } else {
    map[type]?.(add);
  }

  return result;
}
