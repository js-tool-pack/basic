/**
 * 获取时间段常数
 *
 * @returns return {
 *   millisecond: 1,
 *   second: 1000,
 *   minute: 60 * 1000,
 *   hour: 60 * 60 * 1000,
 *   day: 24 * 60 * 60 * 1000,
 *   week: 7 * 24 * 60 * 60 * 1000,
 *   month: 30 * 24 * 60 * 60 * 1000,
 *   season: (365 / 4) * 24 * 60 * 60 * 1000,
 *   year: 365 * 24 * 60 * 60 * 1000,
 * }
 */
export const getTimePeriodConst = (function () {
  const millisecond = 1;
  const second = millisecond * 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const season = day * (365 / 4);
  const year = day * 365;
  const week = day * 7;
  const timeConst = {
    millisecond,
    second,
    minute,
    hour,
    day,
    week,
    month,
    season,
    year,
  } as const;
  return function () {
    return timeConst;
  };
})();
