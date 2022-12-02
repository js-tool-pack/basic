import {
  msToDateStr,
  strToDate,
  formatDate,
  createTimeCountUp,
  createTimeCountDown,
  getTheLastDateOfAMonth,
  dateDiff,
  isSameTime,
  inSameWeek,
  yearDiff,
  calcRelativeDate,
  getMilliseconds,
  getMonthTheNthWeekday,
} from '../src/time';
import { sleep } from '../src';

describe('time', function () {
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
    expect(formatDate(date1, 'yyyyq季')).toBe('2020春季');

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
    expect(formatDate(new Date('2020-01-12'), 'q')).toBe('春');
    expect(formatDate(new Date('2020-02-12'), 'q')).toBe('春');
    expect(formatDate(new Date('2020-03-13'), 'q')).toBe('春');
    expect(formatDate(new Date('2020-04-14'), 'q')).toBe('夏');
    expect(formatDate(new Date('2020-05-15'), 'q')).toBe('夏');
    expect(formatDate(new Date('2020-06-16'), 'q')).toBe('夏');
    expect(formatDate(new Date('2020-07-17'), 'q')).toBe('秋');
    expect(formatDate(new Date('2020-08-18'), 'q')).toBe('秋');
    expect(formatDate(new Date('2020-09-18'), 'q')).toBe('秋');
    expect(formatDate(new Date('2020-10-18'), 'q')).toBe('冬');
    expect(formatDate(new Date('2020-11-18'), 'q')).toBe('冬');
    expect(formatDate(new Date('2020-12-18'), 'q')).toBe('冬');

    // 自定义季节名
    expect(formatDate(new Date('2020-01-12'), 'q', { seasonText: ['spring'] })).toBe('spring');

    // 自定义星期名字
    const weekText = ['sunday', 'monday'];
    expect(formatDate(new Date('2020-01-12'), 'w', { weekText })).toBe('sunday');

    const date2 = strToDate('2019-12-12 10:10:10') as Date;
    expect(formatDate(date2, 'd-M-yy')).toBe('12-12-19');

    expect(formatDate(new Date(2021, 10, 24, 18, 0, 0, 0), 'yyyy-MM-dd hh:mm:ss:SSSS')).toBe(
      '2021-11-24 18:00:00:0000',
    );
  });
  test('createTimeCountUp', async () => {
    const timeCountUp = createTimeCountUp();
    expect(timeCountUp()).toBe(0);

    await sleep(100);
    const t1 = timeCountUp();
    expect(100 <= t1 && t1 <= 200).toBe(true);

    await sleep(100);
    const t2 = timeCountUp();
    expect(200 <= t2 && t2 <= 300).toBe(true);

    await sleep(600);
    const t3 = timeCountUp();
    expect(800 <= t3 && t3 <= 900).toBe(true);
  });
  test('createTimeCountDown', async () => {
    const timeout = 500;
    const timeCountDown = createTimeCountDown(timeout);

    await sleep(50);
    let t1 = timeCountDown();
    expect(timeout - 150 <= t1 && t1 <= timeout - 50).toBe(true);

    await sleep(150);
    t1 = timeCountDown();
    expect(timeout - 300 <= t1 && t1 <= timeout - 200).toBe(true);

    await sleep(350);
    expect(timeCountDown()).toBe(0);
  });
  test('dateDiff', () => {
    expect(dateDiff(new Date('2020-05-01'), new Date('2020-05-06'))).toBe('0年5天00时00分00秒');
    expect(dateDiff(new Date('2020-05-01'), new Date('2020-05-06'), 'dd天 hh时mm分ss秒')).toBe(
      '05天 00时00分00秒',
    );
    expect(
      dateDiff(new Date('2020-05-06'), new Date('2020-05-01 3:20:10'), 'd天 hh时mm分ss秒'),
    ).toBe('5天 04时39分50秒');

    expect(dateDiff(new Date('2020-05-01'), new Date('2020-05-06'), 'd天 h时m分s秒')).toBe(
      '5天 0时0分0秒',
    );
    // expect(dateDiff(new Date('2020-05-06'), new Date('2020-05-01 3:20:10'), 'd天 h时m分s秒')).toBe(
    //   '-5天 -4时-39分-50秒',
    // );
  });

  test('getTheLastDayOfAMonth', async () => {
    expect(getTheLastDateOfAMonth(new Date('2021-1')).getDate()).toBe(31);
    expect(getTheLastDateOfAMonth(new Date('2021-2')).getDate()).toBe(28);
    expect(getTheLastDateOfAMonth(new Date('2021-3')).getDate()).toBe(31);
    expect(getTheLastDateOfAMonth(new Date('2021-4')).getDate()).toBe(30);
    expect(getTheLastDateOfAMonth(new Date('2021-5')).getDate()).toBe(31);
    expect(getTheLastDateOfAMonth(new Date('2021-6')).getDate()).toBe(30);
    expect(getTheLastDateOfAMonth(new Date('2021-7')).getDate()).toBe(31);
    expect(getTheLastDateOfAMonth(new Date('2021-8')).getDate()).toBe(31);
    expect(getTheLastDateOfAMonth(new Date('2021-9')).getDate()).toBe(30);
    expect(getTheLastDateOfAMonth(new Date('2021-10')).getDate()).toBe(31);
    expect(getTheLastDateOfAMonth(new Date('2021-11')).getDate()).toBe(30);
    expect(getTheLastDateOfAMonth(new Date('2021-12')).getDate()).toBe(31);
    expect(getTheLastDateOfAMonth(new Date('2020-2')).getDate()).toBe(29);
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
    const monday = new Date('2022-07-11');

    // 上个星期天
    const lastSunday = new Date('2022-07-10');
    expect(inSameWeek({ now: monday, date: lastSunday })).toBe(false);
    expect(inSameWeek({ now: monday, date: lastSunday, weekStart: 'Mon' })).toBe(false);
    expect(inSameWeek({ now: monday, date: lastSunday, weekStart: 'Sun' })).toBe(true);

    // 星期一到星期六
    for (let i = 0; i < 6; i++) {
      const time = new Date('2022-07-' + (11 + i));
      expect(inSameWeek({ now: monday, date: time })).toBe(true);
      expect(inSameWeek({ now: monday, date: time, weekStart: 'Mon' })).toBe(true);
      expect(inSameWeek({ now: monday, date: time, weekStart: 'Sun' })).toBe(true);
    }

    // 这个星期天
    const curSunday = new Date('2022-07-17');
    expect(inSameWeek({ now: monday, date: curSunday })).toBe(true);
    expect(inSameWeek({ now: monday, date: curSunday, weekStart: 'Mon' })).toBe(true);
    expect(inSameWeek({ now: monday, date: curSunday, weekStart: 'Sun' })).toBe(false);

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
  test('calcRelativeDate', async () => {
    const now = new Date();
    const d = calcRelativeDate(now);

    expect(d().getTime() === now.getTime()).toBe(true);

    await sleep(100);
    expect(now.getTime() + 90 <= d().getTime() && d().getTime() <= now.getTime() + 110).toBe(true);

    await sleep(100);
    expect(now.getTime() + 190 <= d().getTime() && d().getTime() <= now.getTime() + 210).toBe(true);
  });
});
