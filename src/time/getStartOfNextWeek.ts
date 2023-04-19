import { getStartOfWeek } from './getStartOfWeek';

/**
 * 获取某日下个星期开始的date
 *
 * @example
 *
 * ```typescript
 * formatDate(getStartOfNextWeek(new Date('2023/04/19'))); // '2023-04-24 00:00:00'
 * formatDate(getStartOfNextWeek(new Date('2023/04/20'))); // '2023-04-24 00:00:00'
 * formatDate(getStartOfNextWeek(new Date('2023/04/16'))); // '2023-04-17 00:00:00'
 * formatDate(getStartOfNextWeek(new Date('2023/04/10'))); // '2023-04-17 00:00:00'
 *
 * formatDate(getStartOfNextWeek(new Date('2023/04/19'), 'SunDay')); // '2023-04-23 00:00:00'
 * formatDate(getStartOfNextWeek(new Date('2023/04/16'), 'SunDay')); // '2023-04-23 00:00:00'
 * formatDate(getStartOfNextWeek(new Date('2023/04/09'), 'SunDay')); // '2023-04-16 00:00:00'
 * formatDate(getStartOfNextWeek(new Date('2023/04/10'), 'SunDay')); // '2023-04-16 00:00:00'
 * ```
 *
 * @param date
 * @param [weekBegin='monday'] 每个星期开始，可选'SunDay'|'MonDay' 周一 周日，默认周一
 */
export function getStartOfNextWeek(date: Date, weekBegin: 'SunDay' | 'MonDay' = 'MonDay'): Date {
  const d = getStartOfWeek(date, weekBegin);
  d.setDate(d.getDate() + 7);
  return d;
}
