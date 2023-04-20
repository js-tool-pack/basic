import {
  msToDateStr,
  strToDate,
  formatDate,
  createTimeCountUp,
  createTimeCountDown,
  getEndOfMonth,
  dateDiff,
  isSameTime,
  inSameWeek,
  yearDiff,
  calcRelativeDate,
  getMilliseconds,
  getMonthTheNthWeekday,
  getTimePeriodConst,
  howLongAgo,
  getStartOfDate,
  getStartOfWeek,
  getStartOfNextWeek,
} from '../src/time';
import { chunk, createArray, inRange } from '@mxssfd/core';

describe('time', function () {
  jest.useFakeTimers(); // 启用模拟定时器

  test('msToDates', () => {
    expect(msToDateStr(1000, 'd天hh时')).toBe('0天00时');
    expect(msToDateStr(1000)).toBe('0天00时00分01秒');
    expect(msToDateStr(60 * 1000)).toBe('0天00时01分00秒');
    expect(msToDateStr(60 * 60 * 1000)).toBe('0天01时00分00秒');
    expect(msToDateStr(60 * 60 * 24 * 1000)).toBe('1天00时00分00秒');
  });
  test('strToDate', () => {
    const t1 = strToDate('2020-02-02 10:10:10')!.getTime();
    const t2 = strToDate('2020-02-20 10:10:10')!.getTime();
    expect(t2).toBeGreaterThan(t1);
    expect(strToDate('abcd' as any)).toBe(null);

    function fn(date: string, format?: string): string {
      return formatDate(strToDate(date as any) as Date, format);
    }

    expect(fn('2020-02-02', 'yyyy')).toBe('2020');
    expect(fn('2020-02-02', 'MM')).toBe('02');
    expect(fn('2020-02-02', 'dd')).toBe('02');
    expect(fn('2020-02-02', 'yy')).toBe('20');
    expect(fn('2020-02-02', 'hh')).toBe('00');
    expect(fn('2020-02-02', 'mm')).toBe('00');
    expect(fn('2020-02-02', 'ss')).toBe('00');
    expect(fn('2019-03', 'dd')).toBe('01');
    expect(fn('2020-02-02 12:00:00', 'hh')).toBe('12');
    expect(fn('2020-02-02 12:00:00', 'mm')).toBe('00');
    expect(fn('2020-02-02 12:00:00', 'ss')).toBe('00');
    expect(fn('2020-02-02 12:00:10', 'ss')).toBe('10');
    expect(fn('2020-02-02 12:11:10', 'mm')).toBe('11');
    expect(fn('2020-02-02 12:11:10')).toBe('2020-02-02 12:11:10');

    [
      '2020-02-02 10:10:10',
      '2020/02/02 10:10:10',
      '2020/02-02-10-10-10',
      '2020/02/02 10/10/10',
      '2020/02/02/10/10/10',
    ].forEach((time: any) => {
      expect(formatDate(strToDate(time)!)).toBe('2020-02-02 10:10:10');
    });
    expect(strToDate('' as any)).toBe(null);
    expect(strToDate('123cvsd213' as any)).toBe(null);
    expect(strToDate('2020l02/02/10/10/10' as any)).toBe(null);
    expect(strToDate(undefined as any)).toBe(null);
  });
  test('formatDate', () => {
    // 使用默认options
    const date1 = strToDate('2020-02-02 10:10:10') as Date;
    expect(formatDate(date1, 'yyyy-MM-dd')).toBe('2020-02-02');
    expect(formatDate(date1, 'hh:mm:ss')).toBe('10:10:10');
    expect(formatDate(date1, 'dd-MM-yyyy')).toBe('02-02-2020');
    expect(formatDate(date1, 'yyyyq季')).toBe('2020冬季');

    // week start
    expect(formatDate(new Date('2020-01-12'), '周w')).toBe('周日');
    expect(formatDate(new Date('2020-01-12'), 'w')).toBe('日');
    expect(formatDate(new Date('2020-01-13'), 'w')).toBe('一');
    expect(formatDate(new Date('2020-01-14'), 'w')).toBe('二');
    expect(formatDate(new Date('2020-01-15'), 'w')).toBe('三');
    expect(formatDate(new Date('2020-01-16'), 'w')).toBe('四');
    expect(formatDate(new Date('2020-01-17'), 'w')).toBe('五');
    expect(formatDate(new Date('2020-01-18'), 'w')).toBe('六');
    // week end

    // season start
    expect(formatDate(new Date('2020-01-12'), 'q')).toBe('冬');
    expect(formatDate(new Date('2020-02-12'), 'q')).toBe('冬');
    expect(formatDate(new Date('2020-03-13'), 'q')).toBe('春');
    expect(formatDate(new Date('2020-04-14'), 'q')).toBe('春');
    expect(formatDate(new Date('2020-05-15'), 'q')).toBe('春');
    expect(formatDate(new Date('2020-06-16'), 'q')).toBe('夏');
    expect(formatDate(new Date('2020-07-17'), 'q')).toBe('夏');
    expect(formatDate(new Date('2020-08-18'), 'q')).toBe('夏');
    expect(formatDate(new Date('2020-09-18'), 'q')).toBe('秋');
    expect(formatDate(new Date('2020-10-18'), 'q')).toBe('秋');
    expect(formatDate(new Date('2020-11-18'), 'q')).toBe('秋');
    expect(formatDate(new Date('2020-12-18'), 'q')).toBe('冬');

    // 自定义季节名
    const seasonNames = ['spring', 'summer', 'autumn', 'winter'];
    expect(formatDate(new Date('2020-01-12'), 'q', { seasonNames })).toBe('winter');

    // 自定义季节所在月份范围
    const seasonRanges: number[][] = chunk(createArray({ start: 1, len: 12 }), 3);
    expect(formatDate(new Date('2020-01-12'), 'q', { seasonNames, seasonRanges })).toBe('spring');
    expect(formatDate(new Date('2020-12-12'), 'q', { seasonNames, seasonRanges })).toBe('winter');

    // 自定义星期名字
    const weekNames = ['sunday', 'monday'];
    expect(formatDate(new Date('2020-01-12'), 'w', { weekNames })).toBe('sunday');

    const date2 = strToDate('2019-12-12 10:10:10') as Date;
    expect(formatDate(date2, 'd-M-yy')).toBe('12-12-19');

    expect(formatDate(new Date(2021, 10, 24, 18, 0, 0, 0), 'yyyy-MM-dd hh:mm:ss:SSSS')).toBe(
      '2021-11-24 18:00:00:0000',
    );
  });
  test('createTimeCountUp', () => {
    const timeCountUp = createTimeCountUp();
    expect(timeCountUp()).toBe(0);

    // await sleep(100);
    jest.advanceTimersByTime(100);
    const t1 = timeCountUp();
    expect(100 <= t1 && t1 <= 200).toBe(true);

    // await sleep(100);
    jest.advanceTimersByTime(100);
    const t2 = timeCountUp();
    expect(200 <= t2 && t2 <= 300).toBe(true);

    // await sleep(600);
    jest.advanceTimersByTime(600);
    const t3 = timeCountUp();
    expect(800 <= t3 && t3 <= 900).toBe(true);

    // ---- 暂停与重启 ----

    const tcu = createTimeCountUp();
    expect(tcu()).toBe(0);
    // await sleep(1);
    jest.advanceTimersByTime(1);
    tcu.pause();
    const pauseValue = tcu();
    expect(inRange(pauseValue, [0, 3])).toBe(true);

    // await sleep(10);
    jest.advanceTimersByTime(10);
    expect(tcu()).toBe(pauseValue);
    // await sleep(10);
    jest.advanceTimersByTime(10);
    expect(tcu()).toBe(pauseValue);

    tcu.play();
    // await sleep(10);
    jest.advanceTimersByTime(10);
    expect(tcu()).not.toBe(pauseValue);
    expect(inRange(tcu(), [pauseValue - 2, pauseValue + 12])).toBe(true);
  });
  test('createTimeCountDown', () => {
    const timeout = 500;
    const timeCountDown = createTimeCountDown(timeout);

    // await sleep(50);
    jest.advanceTimersByTime(50);
    let t1 = timeCountDown();
    expect(timeout - 150 <= t1 && t1 <= timeout - 50).toBe(true);

    // await sleep(150);
    jest.advanceTimersByTime(150);
    t1 = timeCountDown();
    expect(timeout - 300 <= t1 && t1 <= timeout - 200).toBe(true);

    // await sleep(350);
    jest.advanceTimersByTime(350);
    expect(timeCountDown()).toBe(0);

    // ---- 暂停与重启 ----

    const tcd = createTimeCountDown(100);
    expect(tcd()).toBe(100);
    // await sleep(1);
    jest.advanceTimersByTime(1);
    tcd.pause();
    const pauseValue = tcd();
    expect(inRange(pauseValue, [98, 100])).toBe(true);

    // await sleep(10);
    jest.advanceTimersByTime(10);
    expect(tcd()).toBe(pauseValue);
    // await sleep(10);
    jest.advanceTimersByTime(10);
    expect(tcd()).toBe(pauseValue);

    tcd.play();
    // await sleep(10);
    jest.advanceTimersByTime(10);
    expect(tcd()).not.toBe(pauseValue);
    expect(inRange(tcd(), [pauseValue - 12, pauseValue])).toBe(true);
  });
  test('dateDiff', () => {
    expect(dateDiff(strToDate('2020-05-01')!, strToDate('2020-05-06')!)).toBe('0年5天00时00分00秒');
    expect(dateDiff(strToDate('2020-05-01')!, strToDate('2020-05-06')!, 'dd天 hh时mm分ss秒')).toBe(
      '05天 00时00分00秒',
    );

    expect(new Date('2020-5-6').getHours()).toBe(0);

    expect(
      dateDiff(strToDate('2020-05-06')!, strToDate('2020-05-01 3:20:10')!, 'd天 hh时mm分ss秒'),
    ).toBe('4天 20时39分50秒');

    expect(dateDiff(strToDate('2020-05-01')!, strToDate('2020-05-06')!, 'd天 h时m分s秒')).toBe(
      '5天 0时0分0秒',
    );
    // expect(dateDiff(new Date('2020-05-06'), new Date('2020-05-01 3:20:10'), 'd天 h时m分s秒')).toBe(
    //   '-5天 -4时-39分-50秒',
    // );
  });

  test('getEndOfMonth', async () => {
    expect(getEndOfMonth(new Date('2021-1')).getDate()).toBe(31);
    expect(getEndOfMonth(new Date('2021-2')).getDate()).toBe(28);
    expect(getEndOfMonth(new Date('2021-3')).getDate()).toBe(31);
    expect(getEndOfMonth(new Date('2021-4')).getDate()).toBe(30);
    expect(getEndOfMonth(new Date('2021-5')).getDate()).toBe(31);
    expect(getEndOfMonth(new Date('2021-6')).getDate()).toBe(30);
    expect(getEndOfMonth(new Date('2021-7')).getDate()).toBe(31);
    expect(getEndOfMonth(new Date('2021-8')).getDate()).toBe(31);
    expect(getEndOfMonth(new Date('2021-9')).getDate()).toBe(30);
    expect(getEndOfMonth(new Date('2021-10')).getDate()).toBe(31);
    expect(getEndOfMonth(new Date('2021-11')).getDate()).toBe(30);
    expect(getEndOfMonth(new Date('2021-12')).getDate()).toBe(31);
    expect(getEndOfMonth(new Date('2020-2')).getDate()).toBe(29);
    expect(formatDate(getEndOfMonth(new Date('2020/02/10 10:00:00')))).toBe('2020-02-29 00:00:00');
    expect(formatDate(getEndOfMonth(new Date('2020/12/10 10:00:00')))).toBe('2020-12-31 00:00:00');
    expect(formatDate(getEndOfMonth(new Date('2023/12/10 10:00:00')))).toBe('2023-12-31 00:00:00');
  });
  test('getMonthTheNthWeekday', async () => {
    // const fn = t.getMonthTheLastWeekDay;
    const fn = getMonthTheNthWeekday;

    expect(fn(new Date('2021-4-25'), -1, 1)?.getDate()).toBe(26);
    expect(fn(new Date('2021-2'), -1, 1)?.getDate()).toBe(22);
    expect(fn(new Date('2021-5'), -1, 1)?.getDate()).toBe(31);
    expect(fn(new Date('2021-5'), -1, 5)?.getDate()).toBe(28);
    expect(fn(new Date('2021-8'), -1, 4)?.getDate()).toBe(26);

    // +
    // 2021年4月第一个周4 是 4月1号
    expect(fn(new Date('2021-4'), 1, 4)?.getDate()).toBe(1);
    // 2021年4月第一个周5 是 4月2号
    expect(fn(new Date('2021-4'), 1, 5)?.getDate()).toBe(2);
    expect(fn(new Date('2021-4'), 1, 6)?.getDate()).toBe(3);
    expect(fn(new Date('2021-4'), 1, 0)?.getDate()).toBe(4);
    expect(fn(new Date('2021-4'), 1, 7)?.getDate()).toBe(4);
    expect(fn(new Date('2021-4'), 1, 7)?.getDate()).toBe(4);
    expect(fn(new Date('2021-4'), 1, 1)?.getDate()).toBe(5);
    expect(fn(new Date('2021-4'), 1, 2)?.getDate()).toBe(6);
    expect(fn(new Date('2021-4'), 1, 3)?.getDate()).toBe(7);
    expect(fn(new Date('2021-4'), 2, 4)?.getDate()).toBe(8);
    expect(fn(new Date('2021-4'), 2, 5)?.getDate()).toBe(9);
    expect(fn(new Date('2021-4'), 2, 7)?.getDate()).toBe(11);
    expect(fn(new Date('2021-4'), 4, 3)?.getDate()).toBe(28);
    expect(fn(new Date('2021-3'), 1, 1)?.getDate()).toBe(1);
    expect(fn(new Date('2021-3'), 4, 7)?.getDate()).toBe(28);
    expect(fn(new Date('2021-3'), 5, 7)).toBe(null);
    expect(fn(new Date('2021-3'), 4, 8)).toBe(null);
    expect(fn(new Date('2021-3'), 4, -1)).toBe(null);
    expect(fn(new Date('2021-3'), 4, -1)).toBe(null);

    // -
    // 周日
    // 2021年1月最后一个周日 是 1月31号
    expect(fn(new Date('2021-1'), -1)?.getDate()).toBe(31);
    expect(fn(new Date('2021-2'), -1)?.getDate()).toBe(28);
    expect(fn(new Date('2021-3'), -1)?.getDate()).toBe(28);
    expect(fn(new Date('2021-4'), -1)?.getDate()).toBe(25);
    expect(fn(new Date('2021-5'), -1)?.getDate()).toBe(30);
    expect(fn(new Date('2021-6'), -1)?.getDate()).toBe(27);
    expect(fn(new Date('2021-7'), -1)?.getDate()).toBe(25);
    expect(fn(new Date('2021-8'), -1)?.getDate()).toBe(29);
    expect(fn(new Date('2021-9'), -1)?.getDate()).toBe(26);
    expect(fn(new Date('2021-10'), -1)?.getDate()).toBe(31);
    expect(fn(new Date('2021-11'), -1)?.getDate()).toBe(28);
    expect(fn(new Date('2021-12'), -1)?.getDate()).toBe(26);

    expect(fn(new Date('2021-4'), 1 - 6, 4)?.getDate()).toBe(1);
    expect(fn(new Date('2021-4'), 1 - 6, 5)?.getDate()).toBe(2);
    expect(fn(new Date('2021-4'), 1 - 6, 6)).toBe(null);
    expect(fn(new Date('2021-4'), -4, 6)?.getDate()).toBe(3);
    expect(fn(new Date('2021-4'), 1 - 6, 7)).toBe(null);
    expect(fn(new Date('2021-4'), 1 - 6, 0)).toBe(null);
    expect(fn(new Date('2021-4'), -4, 7)?.getDate()).toBe(4);
    expect(fn(new Date('2021-4'), -4, 0)?.getDate()).toBe(4);
    expect(fn(new Date('2021-4'), 1 - 5, 1)?.getDate()).toBe(5);
    expect(fn(new Date('2021-4'), 1 - 5, 2)?.getDate()).toBe(6);
    expect(fn(new Date('2021-4'), 1 - 5, 3)?.getDate()).toBe(7);
    expect(fn(new Date('2021-4'), 2 - 6, 4)?.getDate()).toBe(8);
    expect(fn(new Date('2021-4'), 2 - 6, 5)?.getDate()).toBe(9);
    expect(fn(new Date('2021-4'), 2 - 5, 7)?.getDate()).toBe(11);
    expect(fn(new Date('2021-4'), 4 - 5, 3)?.getDate()).toBe(28);
    expect(fn(new Date('2021-3'), 1 - 6, 1)?.getDate()).toBe(1);
    expect(fn(new Date('2021-3'), 4 - 5, 7)?.getDate()).toBe(28);
    expect(fn(new Date('2021-4'), 4 - 5, 5)?.getDate()).toBe(30);
  });

  test('getMilliseconds', async () => {
    const fn = getMilliseconds;

    expect(fn()).toBe(0);
    expect(fn({ seconds: 1 })).toBe(1000);
    expect(fn({ seconds: 1.5 })).toBe(1500);
    expect(fn({ seconds: 60 })).toBe(1000 * 60);
    expect(fn({ minutes: 1 })).toBe(1000 * 60);
    expect(fn({ minutes: 1.5 })).toBe(1000 * 90);
    expect(fn({ minutes: 1 })).toBe(fn({ seconds: 60 }));
    expect(fn({ minutes: 1.5 })).toBe(fn({ seconds: 90 }));
    expect(fn({ hours: 1 })).toBe(fn({ minutes: 60 }));
    expect(fn({ days: 1 })).toBe(fn({ hours: 24 }));
    expect(fn({ days: 1.5 })).toBe(fn({ hours: 36 }));
    expect(fn({ days: 1, hours: 1, seconds: 10 })).toBe(
      10 * 1000 + 1000 * 60 * 60 + 1000 * 60 * 60 * 24,
    );
    expect(fn({ days: 1, hours: 1, seconds: 10 })).toBe(
      fn({ days: 1 }) + fn({ hours: 1 }) + fn({ seconds: 10 }),
    );
    expect(fn({ days: 2 })).toBe(fn({ days: 1 }) * 2);
    const date = new Date();

    expect(-fn({ hours: 1 })).toBe(date.getTime() - date.setHours(date.getHours() + 1));
  });
  test('isSameTime', async () => {
    const date = new Date('2021-10-10');
    const date2 = new Date('2021-10-30');

    expect(isSameTime('yyyy-MM', date, date2)).toBe(true);
    expect(isSameTime('yyyy-MM-dd', date, date2)).toBe(false);
    expect(isSameTime('yyyy hh:mm:ss', date, date2)).toBe(true);
  });
  test('inSameWeek', async () => {
    // 星期一
    const monday = strToDate('2022-07-11')!;

    // 上个星期天
    const lastSunday = strToDate('2022-07-10')!;
    expect(inSameWeek({ now: monday, date: lastSunday })).toBe(false);
    expect(inSameWeek({ now: monday, date: lastSunday, weekStart: 'Mon' })).toBe(false);
    expect(inSameWeek({ now: monday, date: lastSunday, weekStart: 'Sun' })).toBe(true);

    // 星期一到星期六
    for (let i = 0; i < 6; i++) {
      const time = strToDate(('2022-07-' + (11 + i)) as `${number}-${number}-${number}`)!;
      expect(inSameWeek({ now: monday, date: time })).toBe(true);
      expect(inSameWeek({ now: monday, date: time, weekStart: 'Mon' })).toBe(true);
      expect(inSameWeek({ now: monday, date: time, weekStart: 'Sun' })).toBe(true);
    }

    // 这个星期天
    const curSunday = strToDate('2022-07-17')!;
    expect(inSameWeek({ now: monday, date: curSunday })).toBe(true);
    expect(inSameWeek({ now: monday, date: curSunday, weekStart: 'Mon' })).toBe(true);
    expect(inSameWeek({ now: monday, date: curSunday, weekStart: 'Sun' })).toBe(false);

    // 星期六
    const curThu = strToDate('2022-07-16')!;
    expect(inSameWeek({ now: curSunday, date: curThu })).toBe(true);
    expect(inSameWeek({ now: curSunday, date: curThu, weekStart: 'Mon' })).toBe(true);
    expect(inSameWeek({ now: curSunday, date: curThu, weekStart: 'Sun' })).toBe(false);

    // 与当天对比
    expect(inSameWeek({ date: new Date() })).toBe(true);
  });

  test('yearDiff', () => {
    expect(yearDiff(new Date('2022-07-01'), new Date('2020-7-1'))).toBe(2);
    expect(yearDiff(new Date('2022-07-02'), new Date('2020-7-1'))).toBe(2.002);
    expect(yearDiff(new Date('2022-07-01'), new Date('2022-1-1'))).toBe(0.5);
    expect(yearDiff(new Date('2022-1-1'), new Date('2022-07-01'))).toBe(-0.5);
    expect(yearDiff(new Date('2022-1-30'), new Date('2022-01-31'))).toBe(-0.002);
  });
  test('calcRelativeDate', () => {
    const now = new Date();
    const d = calcRelativeDate(now);

    expect(d().getTime() === now.getTime()).toBe(true);

    jest.advanceTimersByTime(100); // 模拟100豪秒的时间流逝
    expect(now.getTime() + 90 <= d().getTime() && d().getTime() <= now.getTime() + 110).toBe(true);

    jest.advanceTimersByTime(100);
    expect(now.getTime() + 190 <= d().getTime() && d().getTime() <= now.getTime() + 210).toBe(true);
    jest.runAllTimers();
  });

  test('getTimePeriodConst', () => {
    const timePeriodConst = getTimePeriodConst();

    expect(timePeriodConst).toEqual({
      millisecond: 1,
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      season: (365 / 4) * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    } satisfies typeof timePeriodConst);
  });
  test('howLongAgo', () => {
    const date = new Date('2023/4/7 00:00:00');
    expect(howLongAgo(date, { now: date })).toBe('刚刚');
    expect(howLongAgo(new Date())).toBe('刚刚');
    expect(howLongAgo(date, { now: new Date('2023/4/7 00:00:20') })).toBe('20秒前');
    expect(howLongAgo(date, { now: new Date('2023/4/7 00:10:20') })).toBe('10分钟前');
    expect(howLongAgo(date, { now: new Date('2023/4/7 08:00:00') })).toBe('8小时前');
    expect(howLongAgo(date, { now: new Date('2023/4/10 00:00:00') })).toBe('3天前');

    expect(howLongAgo(date, { now: new Date('2023/4/15 00:00:00') })).toBe('1周前');
    expect(howLongAgo(date, { now: new Date('2023/5/6 00:00:00') })).toBe('4周前');

    expect(howLongAgo(date, { now: new Date('2023/5/7 00:00:00') })).toBe('1月前');
    // 因为过去多少月是按天数算的，5月有31天，所以到6月6号已经是2月前了
    expect(howLongAgo(date, { now: new Date('2023/6/6 00:00:00') })).toBe('2月前');
    expect(howLongAgo(date, { now: new Date('2023/7/7 00:00:00') })).toBe('3月前');

    // 按天数算的，5月有31天，一季按91.25(365/4)天算
    expect(howLongAgo(date, { now: new Date('2023/7/8 00:00:00') })).toBe('1季前');

    expect(howLongAgo(date, { now: new Date('2024/7/7 00:00:00') })).toBe('1年前');

    // now比date小
    expect(howLongAgo(date, { now: new Date('2022/7/8 00:00:00') })).toBe('2023-04-07 00:00:00');
    expect(howLongAgo(date, { now: new Date('2022/7/8 00:00:00'), def: '--' })).toBe('--');
    expect(howLongAgo(date, { now: new Date('2022/7/8 00:00:00'), defaultFormat: 'yyyy' })).toBe(
      '2023',
    );

    // 更换模板
    const templates: Required<Parameters<typeof howLongAgo>>[1]['templates'] = {};

    // 更换秒数模板
    templates.second = '刚刚';
    expect(howLongAgo(date, { now: new Date('2023/4/7 00:00:20'), templates })).toBe('刚刚');

    // 更换小时数模板
    templates.hour = '${ago} hours ago';
    expect(howLongAgo(date, { now: new Date('2023/4/7 08:00:00'), templates })).toBe('8 hours ago');

    // 更换周数模板
    templates.week = '${ago}星期前';
    expect(howLongAgo(date, { now: new Date('2023/4/15 00:00:00'), templates })).toBe('1星期前');
    expect(howLongAgo(date, { now: new Date('2023/5/6 00:00:00'), templates })).toBe('4星期前');

    // 去掉周数
    templates.week = '~~';
    expect(howLongAgo(date, { now: new Date('2023/4/15 00:00:00'), templates })).toBe('8天前');
    expect(howLongAgo(date, { now: new Date('2023/5/6 00:00:00'), templates })).toBe('29天前');

    // 去掉季节
    templates.season = '~~';
    expect(howLongAgo(date, { now: new Date('2023/7/8 00:00:00'), templates })).toBe('3月前');

    // ------- filter -------
    // 使用filter替换季数
    expect(
      howLongAgo(date, {
        now: new Date('2023/10/8 00:00:00'),
        filter: (res, diff) =>
          res.endsWith('季前') ? ~~(diff / getTimePeriodConst().season) + ' seasons ago' : res,
      }),
    ).toBe('2 seasons ago');

    // 混合
    expect(
      howLongAgo(date, {
        now: new Date('2023/4/7 02:10:00'),
        filter: (res, diff) => {
          if (res.endsWith('小时前')) {
            const tpc = getTimePeriodConst();
            return `${~~(diff / tpc.hour)}小时${~~((diff % tpc.hour) / tpc.minute)}分钟前`;
          }
          return res;
        },
      }),
    ).toBe('2小时10分钟前');

    // default now
    const d = new Date();
    d.setHours(d.getHours() - 8);
    expect(howLongAgo(d, { templates })).toBe('8 hours ago');
  });
  test('getDateBegin', () => {
    expect(formatDate(getStartOfDate(new Date('2023/04/19 12:10:50')))).toBe('2023-04-19 00:00:00');
  });
  test('getStartOfWeek', () => {
    expect(formatDate(getStartOfWeek(new Date('2023/04/19')))).toBe('2023-04-17 00:00:00');
    expect(formatDate(getStartOfWeek(new Date('2023/04/20')))).toBe('2023-04-17 00:00:00');
    expect(formatDate(getStartOfWeek(new Date('2023/04/16')))).toBe('2023-04-10 00:00:00');
    expect(formatDate(getStartOfWeek(new Date('2023/04/10')))).toBe('2023-04-10 00:00:00');

    expect(formatDate(getStartOfWeek(new Date('2023/04/19'), 'SunDay'))).toBe(
      '2023-04-16 00:00:00',
    );
    expect(formatDate(getStartOfWeek(new Date('2023/04/16'), 'SunDay'))).toBe(
      '2023-04-16 00:00:00',
    );
    expect(formatDate(getStartOfWeek(new Date('2023/04/09'), 'SunDay'))).toBe(
      '2023-04-09 00:00:00',
    );
    expect(formatDate(getStartOfWeek(new Date('2023/04/10'), 'SunDay'))).toBe(
      '2023-04-09 00:00:00',
    );
  });
  test('getStartOfNextWeek', () => {
    expect(formatDate(getStartOfNextWeek(new Date('2023/04/19')))).toBe('2023-04-24 00:00:00');
    expect(formatDate(getStartOfNextWeek(new Date('2023/04/20')))).toBe('2023-04-24 00:00:00');
    expect(formatDate(getStartOfNextWeek(new Date('2023/04/16')))).toBe('2023-04-17 00:00:00');
    expect(formatDate(getStartOfNextWeek(new Date('2023/04/10')))).toBe('2023-04-17 00:00:00');

    expect(formatDate(getStartOfNextWeek(new Date('2023/04/19'), 'SunDay'))).toBe(
      '2023-04-23 00:00:00',
    );
    expect(formatDate(getStartOfNextWeek(new Date('2023/04/16'), 'SunDay'))).toBe(
      '2023-04-23 00:00:00',
    );
    expect(formatDate(getStartOfNextWeek(new Date('2023/04/09'), 'SunDay'))).toBe(
      '2023-04-16 00:00:00',
    );
    expect(formatDate(getStartOfNextWeek(new Date('2023/04/10'), 'SunDay'))).toBe(
      '2023-04-16 00:00:00',
    );
  });
});
