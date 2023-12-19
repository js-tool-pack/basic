import { getStartOfWeek } from './getStartOfWeek';
import { dateAdd } from './dateAdd';

/**
 * 获取某日所在星期结束的date
 *
 * @example
 *
 * const getEnd = (date: string, options?: Parameters<typeof getEndOfWeek>[1]) => formatDate(getEndOfWeek(new Date(date), options));
 *
 * // 星期一为星期第一天
 * getEnd('2023/04/19', { firstDay: 1 }); // '2023-04-23 00:00:00'
 * getEnd('2023/04/20', { firstDay: 1 }); // '2023-04-23 00:00:00'
 * getEnd('2023/04/16', { firstDay: 1 }); // '2023-04-16 00:00:00'
 * getEnd('2023/04/10', { firstDay: 1 }); // '2023-04-16 00:00:00'
 *
 * // 星期天为星期第一天
 * getEnd('2023/04/19'); // '2023-04-22 00:00:00'
 * getEnd('2023/04/16'); // '2023-04-22 00:00:00'
 * getEnd('2023/04/09'); // '2023-04-15 00:00:00'
 * getEnd('2023/04/10'); // '2023-04-15 00:00:00'
 *
 * @see getStartOfWeek
 *
 * @param date
 * @param [firstDay=0] 每个星期的开始，可选0-7.默认0周日
 * @param [weekOffset=0] 星期的偏移量，当值为 1 时是下个星期，为-1 时是上个星期以此类推.默认为 0
 */
export function getEndOfWeek(
  date: Date,
  { firstDay = 0, weekOffset = 0 }: Parameters<typeof getStartOfWeek>[1] = {},
): Date {
  return dateAdd(getStartOfWeek(date, { firstDay, weekOffset: weekOffset + 1 }), -1, 'date');
}
