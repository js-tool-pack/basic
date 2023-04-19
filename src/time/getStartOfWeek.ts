import { getStartOfDate } from './getStartOfDate';

/**
 * 获取某日所在星期开始的date
 *
 * @example
 *
 * ```typescript
 * formatDate(getStartOfWeek(new Date('2023/04/19'))); // '2023-04-17 00:00:00'
 * formatDate(getStartOfWeek(new Date('2023/04/20'))); // '2023-04-17 00:00:00'
 * formatDate(getStartOfWeek(new Date('2023/04/16'))); // '2023-04-10 00:00:00'
 * formatDate(getStartOfWeek(new Date('2023/04/10'))); // '2023-04-10 00:00:00'
 *
 * formatDate(getStartOfWeek(new Date('2023/04/19'), 'SunDay')); // '2023-04-16 00:00:00'
 * formatDate(getStartOfWeek(new Date('2023/04/16'), 'SunDay')); // '2023-04-16 00:00:00'
 * formatDate(getStartOfWeek(new Date('2023/04/09'), 'SunDay')); // '2023-04-09 00:00:00'
 * formatDate(getStartOfWeek(new Date('2023/04/10'), 'SunDay')); // '2023-04-09 00:00:00'
 * ```
 *
 * @param date
 * @param [weekBegin='monday'] 每个星期开始，可选'SunDay'|'MonDay' 周一 周日，默认周一
 */
export function getStartOfWeek(date: Date, weekBegin: 'SunDay' | 'MonDay' = 'MonDay'): Date {
  const d = new Date(date);
  const [begin, offset] = weekBegin === 'MonDay' ? [7, -1] : [0, 0];
  d.setDate(d.getDate() - ((d.getDay() || begin) + offset));
  return getStartOfDate(d);
}
