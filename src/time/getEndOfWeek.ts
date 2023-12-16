import { getStartOfNextWeek } from './getStartOfNextWeek';
import { dateAdd } from './dateAdd';

/**
 * 获取某日所在星期结束的date
 *
 * @example
 *
 * ```typescript
 * formatDate(getEndOfWeek(new Date('2023/04/19'))); // '2023-04-23 00:00:00'
 * formatDate(getEndOfWeek(new Date('2023/04/20'))); // '2023-04-23 00:00:00'
 * formatDate(getEndOfWeek(new Date('2023/04/16'))); // '2023-04-16 00:00:00'
 * formatDate(getEndOfWeek(new Date('2023/04/10'))); // '2023-04-16 00:00:00'
 *
 * formatDate(getEndOfWeek(new Date('2023/04/19'), 'SunDay')); // '2023-04-22 00:00:00'
 * formatDate(getEndOfWeek(new Date('2023/04/16'), 'SunDay')); // '2023-04-22 00:00:00'
 * formatDate(getEndOfWeek(new Date('2023/04/09'), 'SunDay')); // '2023-04-15 00:00:00'
 * formatDate(getEndOfWeek(new Date('2023/04/10'), 'SunDay')); // '2023-04-15 00:00:00'
 * ```
 *
 * @param date
 * @param [weekBegin='MonDay'] 每个星期开始，可选'SunDay'|'MonDay' 周一 周日，默认周一
 */
export function getEndOfWeek(date: Date, weekBegin: 'SunDay' | 'MonDay' = 'MonDay'): Date {
  return dateAdd(getStartOfNextWeek(date, weekBegin), -1, 'date');
}
