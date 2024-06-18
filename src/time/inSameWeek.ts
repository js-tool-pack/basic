/**
 * 判断两个日期是否在同一个星期内
 *
 * @example
 *
 * // 星期一
 * const monday = new Date('2022-07-11');
 *
 * // 上个星期天
 * const lastSunday = new Date('2022-07-10');
 * inSameWeek({ now: monday, date: lastSunday }); // false
 * inSameWeek({ now: monday, date: lastSunday, weekStart: 'Mon' }); // false
 * inSameWeek({ now: monday, date: lastSunday, weekStart: 'Sun' }); // true
 *
 * // 星期一到星期六
 * for (let i = 0; i < 6; i++) {
 *   const time = new Date('2022-07-' + (11 + i));
 *   inSameWeek({ now: monday, date: time }); // true
 *   inSameWeek({ now: monday, date: time, weekStart: 'Mon' }); // true
 *   inSameWeek({ now: monday, date: time, weekStart: 'Sun' }); // true
 * }
 *
 * // 这个星期天
 * const curSunday = new Date('2022-07-17');
 * inSameWeek({ now: monday, date: curSunday }); // true
 * inSameWeek({ now: monday, date: curSunday, weekStart: 'Mon' }); // true
 * inSameWeek({ now: monday, date: curSunday, weekStart: 'Sun' }); // false
 *
 * // 与当天对比
 * inSameWeek({ date: new Date() }); // true
 *
 * @param options
 * @param options.date 要对比的日期
 * @param  options.weekStart 每个星期开始为星期一或星期天， 默认星期一
 * @param options.now 日期 默认为当天
 */
export function inSameWeek({
  weekStart = 'Mon',
  now = new Date(),
  date,
}: {
  weekStart?: 'Mon' | 'Sun';
  date: Date;
  now?: Date;
}): boolean {
  const timeStamp = date.getTime();
  const day = now.getDay() || (weekStart === 'Mon' ? 7 : 0);
  const dateNum = now.getDate();
  // 时分秒归零
  const start = new Date(now.getFullYear(), now.getMonth(), dateNum);
  const end = new Date(start);
  const weekStartValue = weekStart === 'Mon' ? 1 : 0;
  start.setDate(dateNum - day + weekStartValue);
  end.setDate(dateNum + (7 - day + weekStartValue));
  const startTime = start.getTime();
  const endTime = end.getTime();
  return startTime <= timeStamp && timeStamp < endTime;
}
