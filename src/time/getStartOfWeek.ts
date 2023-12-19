import { getStartOfDate } from './getStartOfDate';
import type { WEEK_DAYS } from './time.type';
import { dateAdd } from './dateAdd';

/**
 * 获取某日所在星期开始的date
 *
 * @example
 *
 * const getStart = (date: string, options?: Parameters<typeof getStartOfWeek>[1]) => formatDate(getStartOfWeek(new Date(date), options));
 *
 * // ----- 当前星期 -----
 * // firstDay 为星期一
 * getStart('2023/04/19', { firstDay: 1 }); // '2023-04-17 00:00:00'
 * // firstDay 为星期日
 * getStart('2023/04/19', { firstDay: 0 }); // '2023-04-16 00:00:00'
 * // firstDay 为星期三
 * getStart('2023/04/16', { firstDay: 3 }); // '2023-04-12 00:00:00'
 *
 * // ----- 上个星期 -----
 * // firstDay 为星期一
 * getStart('2023/04/19', { firstDay: 1, weekOffset: -1 }); // '2023-04-10 00:00:00'
 * // firstDay 为星期日
 * getStart('2023/04/19', { firstDay: 0, weekOffset: -1 }); // '2023-04-09 00:00:00'
 *
 * // ----- 下个星期 -----
 * // firstDay 为星期一
 * getStart('2023/04/19', { firstDay: 1, weekOffset: 1 }); // '2023-04-24 00:00:00'
 * // firstDay 为星期日
 * getStart('2023/04/19', { firstDay: 0, weekOffset: 1 }); // '2023-04-23 00:00:00'
 *
 *
 * @param date 日期
 * @param [firstDay=0] 每个星期的开始，可选0-7.默认0周日
 * @param [weekOffset=0] 星期的偏移量，当值为 1 时是下个星期，为-1 时是上个星期以此类推.默认为 0
 */
export function getStartOfWeek(
  date: Date,
  { firstDay = 0, weekOffset = 0 }: { firstDay?: WEEK_DAYS; weekOffset?: number } = {},
): Date {
  const _date = dateAdd(date, weekOffset, 'week');
  const day = _date.getDay();
  const offset = day >= firstDay ? day - firstDay : day + (7 - firstDay);
  _date.setDate(_date.getDate() - offset);
  return getStartOfDate(_date);
}
