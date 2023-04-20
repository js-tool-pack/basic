import { inRange } from '../array';
import { getEndOfMonth } from './getEndOfMonth';

/**
 * 获取指定某年月份(month)第n(nth)个星期几(weekday)的Date
 *
 * @example
 *
 * const fn = getMonthTheNthWeekday;
 * // 2021年4月第一个周4 是 4月1号
 * fn(new Date('2021-4'), 1, 4)?.getDate(); // 1
 * // 2021年4月第一个周5 是 4月2号
 * fn(new Date('2021-4'), 1, 5)?.getDate(); // 2
 * // ...
 * fn(new Date('2021-4'), 1, 6)?.getDate(); // 3
 * fn(new Date('2021-4'), 1, 0)?.getDate(); // 4
 * fn(new Date('2021-4'), 1, 7)?.getDate(); // 4
 * fn(new Date('2021-4'), 1, 7)?.getDate(); // 4
 * fn(new Date('2021-4'), 1, 1)?.getDate(); // 5
 *
 * // 2021年1月最后一个周日 是 1月31号
 * fn(new Date('2021-1'), -1)?.getDate(); // 31
 *
 * @param month 月份所在Date
 * @param nth nth为负的时候从月末开始倒数
 * @param [weekday=0] 0和7都是周日
 */
export function getMonthTheNthWeekday(month: Date, nth: number, weekday = 0) {
  // if (!nth || weekday < 0 || weekday > 7) return null;
  if (!nth || !inRange(weekday, [0, 7])) return null;
  const monthTime = month.getTime();
  const endDate = getEndOfMonth(month);
  let date: Date;
  if (nth > 0) {
    date = new Date(monthTime);
    date.setDate(1);
  } else {
    date = new Date(endDate.getTime());
  }
  weekday = weekday === 0 ? 7 : weekday;
  const diff = weekday - date.getDay();
  if (nth > 0) {
    diff >= 0 && nth--;
  } else {
    diff <= 0 && nth++;
  }
  const dayDate = nth * 7 + date.getDate() + diff;
  if (dayDate > endDate.getDate() || dayDate < 1) {
    return null;
  }
  date.setDate(dayDate);
  return date;
}
