import { inRange } from './array';

/**
 * 把毫秒值转为天数
 *
 * @example
 *
 * msToDateStr(1000, 'd天hh时'); // '0天00时'
 * msToDateStr(1000); // '0天00时00分01秒'
 * msToDateStr(60 * 1000); // '0天00时01分00秒'
 * msToDateStr(60 * 60 * 1000); // '0天01时00分00秒'
 * msToDateStr(60 * 60 * 24 * 1000); // '1天00时00分00秒'
 *
 * @param ms 毫秒值
 * @param [format=d天hh时mm分ss秒] - 格式化模板，默认'd天hh时mm分ss秒'
 */
export function msToDateStr(ms: number, format = 'd天hh时mm分ss秒') {
  let result = format;
  const seconds = ms / 1000;
  const obj: { [k: string]: number } = {
    's+': seconds % 60,
    'm+': ~~(seconds / 60) % 60,
    'h+': ~~(seconds / (60 * 60)) % 24,
    // 'd+': ~~(seconds / (60 * 60 * 24))
  };
  // 有多少天就显示多少天,但不会补0
  const days = ~~(seconds / (60 * 60 * 24));
  result = result.replace(/d+/, String(days));
  for (const k in obj) {
    const reg = new RegExp('(' + k + ')');
    if (reg.test(result)) {
      const s1 = RegExp.$1;
      const v = obj[k];
      let value = String(v).padStart(s1.length, '0');
      value = value.substring(value.length - s1.length);
      result = result.replace(s1, value);
    }
  }
  return result;
}

/**
 * 格式化日期
 *
 * @example
 *
 * // 使用默认options
 * const date1 = t.strToDate('2020-02-02 10:10:10') as Date;
 * formatDate(date1, 'yyyy-MM-dd'); // '2020-02-02'
 * formatDate(date1, 'hh:mm:ss'); // '10:10:10'
 * formatDate(date1, 'dd-MM-yyyy'); // '02-02-2020'
 * formatDate(date1, 'yyyyq季'); // '2020冬季'
 *
 * // 星期
 * formatDate(new Date('2020-01-12'), '周w'); // '周日'
 * formatDate(new Date('2020-01-12'), 'w'); // '日'
 * formatDate(new Date('2020-01-13'), 'w'); // '一'
 * formatDate(new Date('2020-01-14'), 'w'); // '二'
 * formatDate(new Date('2020-01-15'), 'w'); // '三'
 * formatDate(new Date('2020-01-16'), 'w'); // '四'
 * formatDate(new Date('2020-01-17'), 'w'); // '五'
 * formatDate(new Date('2020-01-18'), 'w'); // '六'
 *
 * // 季节
 * formatDate(new Date('2020-01-12'), 'q'); // '冬'
 * formatDate(new Date('2020-02-12'), 'q'); // '冬'
 * formatDate(new Date('2020-03-13'), 'q'); // '春'
 * formatDate(new Date('2020-04-14'), 'q'); // '春'
 * formatDate(new Date('2020-05-15'), 'q'); // '春'
 * formatDate(new Date('2020-06-16'), 'q'); // '夏'
 * formatDate(new Date('2020-07-17'), 'q'); // '夏'
 * formatDate(new Date('2020-08-18'), 'q'); // '夏'
 * formatDate(new Date('2020-09-18'), 'q'); // '秋'
 * formatDate(new Date('2020-10-18'), 'q'); // '秋'
 * formatDate(new Date('2020-11-18'), 'q'); // '秋'
 * formatDate(new Date('2020-12-18'), 'q'); // '冬'
 *
 * // 自定义季节名
 * const seasonNames = ['spring', 'summer', 'autumn', 'winter'];
 * formatDate(new Date('2020-01-12'), 'q', { seasonNames }); // 'winter'
 *
 * // 自定义季节所在月份范围
 * const seasonRanges: number[][] = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];
 * formatDate(new Date('2020-01-12'), 'q', { seasonNames, seasonRanges }); // 'spring'
 * formatDate(new Date('2020-12-12'), 'q', { seasonNames, seasonRanges }); // 'winter'
 *
 * // 自定义星期名字
 * const weekNames = ['sunday', 'monday'];
 * formatDate(new Date('2020-01-12'), 'w', { weekNames }); // 'sunday'
 *
 * @param [formular='yyyy-MM-dd hh:mm:ss']
 * @param formular 格式，默认：'yyyy-MM-dd hh:mm:ss'
 * @param date 日期
 * @param options 可选选项
 * @param options.seasonNames 季节名数组，默认：['春', '夏', '秋', '冬']
 * @param options.seasonRanges 季节所在月份范围，默认：春季为3-5月，夏季为6-8月、秋季为9-11月、冬季为12-2月
 * @param options.weekNames 星期名数组，默认：['日', '一', '二', '三', '四', '五', '六']
 */
export function formatDate(
  date: Date,
  formular = 'yyyy-MM-dd hh:mm:ss',
  options?: {
    seasonNames?: string[];
    seasonRanges?: number[][];
    weekNames?: string[];
  },
) {
  const opt = {
    weekNames: ['日', '一', '二', '三', '四', '五', '六'],
    seasonNames: ['春', '夏', '秋', '冬'],
    seasonRanges: [
      [3, 4, 5],
      [6, 7, 8],
      [9, 10, 11],
      [12, 1, 2],
    ],
    ...options,
  };
  const o: Record<string, Function> = {
    'M+': () => date.getMonth() + 1, //月份
    'd+': () => date.getDate(), //日
    'h+': () => date.getHours(), //小时
    'm+': () => date.getMinutes(), //分
    's+': () => date.getSeconds(), //秒
    q: () => {
      //季度
      // 按月份区分的季度并不真的准确
      // 春季为3-5月，夏季为6-8月、秋季为9-11月、冬季为12-2月
      const month = date.getMonth() + 1;
      const qIndex = opt.seasonRanges.findIndex((range) => range.includes(month));
      return opt.seasonNames[qIndex];
    },
    'S+': () => date.getMilliseconds(), //毫秒
    w: () => opt.weekNames[date.getDay()], //周
  };
  if (/(y+)/.test(formular)) {
    const y = RegExp.$1;
    formular = formular.replace(
      y,
      String(date.getFullYear()).padStart(y.length, '0').slice(-y.length),
    );
  }
  let result = formular;
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(formular)) {
      const s1 = RegExp.$1;
      const v = String((o[k] as Function)());
      result = result.replace(s1, v.padStart(s1.length, '0'));
    }
  }
  return result;
}

/**
 * 字符串转为date对象
 * ---
 * 因为部分浏览器如苹果手机直接new Date("2018-08-01 10:20:10")会失败，所以提取出这样一个函数
 *
 * 直接new Date还有时区问题，例如
 *
 * ```
 * new Date('2020-05-06').getHours(); // 8 默认8点(东八区)
 * new Date('2020-5-6').getHours(); // 0  默认0点
 * ```
 *
 * 只有`'Tue Dec 13 2022 01:16:59 GMT+0800 (中国标准时间)'`这种时间才直接new
 *
 * @example
 *
 * [
 *   '2020-02-02 10:10:10',
 *   '2020/02/02 10:10:10',
 *   '2020/02-02-10-10-10',
 *   '2020/02/02 10/10/10',
 *   '2020/02/02/10/10/10',
 * ].forEach((time: any) => {
 *   formatDate(strToDate(time); // '2020-02-02 10:10:10'
 * });
 * strToDate('' as any); // null
 * strToDate('123cvsd213' as any); // null
 * strToDate('2020l02/02/10/10/10' as any); // null
 * strToDate(undefined as any); // null
 *
 * @param [date='yyyy-MM-dd hh:mm:ss'] 格式，默认值: 'yyyy-MM-dd hh:mm:ss'
 */
export function strToDate(
  date:
    | `${number}-${number}-${number}`
    | `${number}-${number}-${number} ${number}:${number}`
    | `${number}-${number}-${number} ${number}:${number}:${number}`
    | `${number}/${number}/${number}`
    | `${number}/${number}/${number} ${number}:${number}`
    | `${number}/${number}/${number} ${number}:${number}:${number}`,
): Date | null {
  // 检测非数字、非/、非:、非-
  if (!date || /[^/\d: -]/.test(date)) return null; // 去除不符合规范的字符串
  const arr: number[] = date.split(/[- :/]/).map((item) => Number(item));
  if (arr.length < 6) {
    for (let i = arr.length; i < 6; i++) {
      arr[i] = i < 3 ? 1 : 0; // 年月日最小为1
    }
  }
  return new Date(arr[0] as number, (arr[1] as number) - 1, arr[2], arr[3], arr[4], arr[5]);
}

/**
 * 比较两个日期相差年天时分秒
 *
 * 用于倒计时等，可与createTimeCountUp等搭配使用
 *
 * @example
 *
 * dateDiff(new Date('2020-05-01'), new Date('2020-05-06')); // '0年5天00时00分00秒'
 * dateDiff(new Date('2020-05-01'), new Date('2020-05-06'), 'dd天 hh时mm分ss秒'); // '05天 00时00分00秒'
 * dateDiff(new Date('2020-05-06'), new Date('2020-05-01 3:20:10'), 'd天 hh时mm分ss秒'); // '5天 04时39分50秒'
 * dateDiff(new Date('2020-05-01'), new Date('2020-05-06'), 'd天 h时m分s秒'); // '5天 0时0分0秒'
 *
 * @param start
 * @param end
 * @param [format="y年d天hh时mm分ss秒"]
 */
export function dateDiff(start: Date, end: Date, format = 'y年d天hh时mm分ss秒'): string {
  let result = format;
  if (start.getTime() > end.getTime()) {
    [start, end] = [end, start];
  }
  const targetTime = end.getTime() - start.getTime();
  const seconds = ~~(targetTime / 1000);
  const obj: { [k: string]: number } = {
    'S+': targetTime % 1000,
    's+': seconds % 60,
    'm+': ~~(seconds / 60) % 60,
    'h+': ~~(seconds / (60 * 60)) % 24,
    'd+': (function (): number {
      const day = ~~(seconds / (60 * 60 * 24));
      // 如果要显示年，则把天余年，否则全部显示天
      // 默认一年等于365天
      return /y+/.test(result) ? day % 365 : day;
    })(),
    // "M+": 0,
    'y+': ~~(seconds / (60 * 60 * 24 * 365)),
  };

  for (const k in obj) {
    const reg = new RegExp('(' + k + ')');
    if (reg.test(result)) {
      // 奇怪的bug 本地调试的时候RegExp.$1不准确,"s+"的时候$1是空字符串; 非调试的时候又没问题
      const s1 = RegExp.$1;
      const v = obj[k];
      let value = String(v).padStart(s1.length, '0');
      // substring(start,end) start小于0的时候为0  substr(from,len)from小于0的时候为字符串的长度+from
      value = value.substring(value.length - s1.length); //手动切割00:00 m:s "00".length - "s".length，因为strPadStart当字符串长度大于length的话不会切割
      result = result.replace(s1, value);
    }
  }
  return result;
}

// 比较两个日期相差年天时分秒  用于倒计时等
/*
export function dateDiff(first: Date, second: Date, format: string = "Y年d天 H时m分s秒"): string {
    const seconds = ~~((second.getTime() - first.getTime()) / 1000);
    const Time: { [k: string]: number } = {
        "s+": seconds % 60,
        "m+": ~~(seconds / 60) % 60,
        "H+": ~~(seconds / (60 * 60)) % 24,
        "d+": (function (): number {
            const day = ~~(seconds / (60 * 60 * 24));
            // 如果要显示年，则把天余年，否则全部显示天
            // 默认一年等于365天
            return /Y+/.test(format) ? day % 365 : day;
        })(),
        // "M+": 0,
        "Y+": ~~(seconds / (60 * 60 * 24 * 365)),
    };

    for (let k in Time) {
        format = format.replace(new RegExp(k), String(Time[k]));
    }
    return format;
}
*/

/**
 * 创建一个记录了调用时间的计时器闭包函数
 *
 * @example
 *
 * const timeCountUp = createTimeCountUp();
 * timeCountUp(); // 0
 *
 * await sleep(100);
 * const t1 = timeCountUp();
 * 100 <= t1 && t1 <= 200; // true
 *
 * await sleep(100);
 * const t2 = timeCountUp();
 * 200 <= t2 && t2 <= 300; // true
 *
 * await sleep(600);
 * const t3 = timeCountUp();
 * 800 <= t3 && t3 <= 900; // true
 *
 * t3.pause(); // 暂停
 * t3.play(); // 继续
 *
 */
export function createTimeCountUp(): { (): number; pause(): void; play(): void } {
  const startTime = Date.now();
  const pause = {
    total: 0,
    startTime: 0,
  };

  function closure(this: any) {
    const endTime = pause.startTime ? pause.startTime : Date.now();
    return endTime - startTime - pause.total;
  }
  closure.pause = function () {
    pause.startTime = Date.now();
  };
  closure.play = function () {
    pause.total += Date.now() - pause.startTime;
    pause.startTime = 0;
  };
  return closure;
}

/*
/!**
 * 创建一个倒计时函数
 * @param countDown 目标毫秒
 *!/
export function createTimeCountDown(countDown: number): () => number {
    const startTime = Date.now();
    return function () {
        const ms = Date.now() - startTime;
        return countDown - ms;
    };
}*/

/**
 * 创建一个倒计时闭包函数
 *
 * @example
 *
 * const timeout = 500;
 * const timeCountDown = createTimeCountDown(timeout);
 *
 * await sleep(50);
 * let t1 = timeCountDown();
 * timeout - 150 <= t1 && t1 <= timeout - 50; // true
 *
 * await sleep(150);
 * t1 = timeCountDown();
 * timeout - 300 <= t1 && t1 <= timeout - 200; // true
 *
 * await sleep(350);
 * timeCountDown(); // 0
 *
 * t1.pause(); // 暂停
 * t1.play(); // 继续
 *
 * @param timeout 倒计时时长(毫秒)
 * @returns {()=> number} 返回一个闭包函数，闭包返回的是倒计时，倒计时最小为0，不会是负数
 */
export function createTimeCountDown(timeout: number): ReturnType<typeof createTimeCountUp> {
  const timeCountUp = createTimeCountUp();

  const finishedFn = () => 0;
  let resFn = () => {
    const res = timeout - timeCountUp();
    if (res > 0) return res;
    resFn = finishedFn;
    return 0;
  };
  function closure(): number {
    return resFn();
  }
  closure.pause = timeCountUp.pause;
  closure.play = timeCountUp.play;
  return closure;
}

/**
 * 获取某月最后一天的date
 *
 * @example
 *
 * getTheLastDateOfAMonth(new Date('2021-1')).getDate(); // 31
 * getTheLastDateOfAMonth(new Date('2021-2')).getDate(); // 28
 * getTheLastDateOfAMonth(new Date('2021-3')).getDate(); // 31
 * getTheLastDateOfAMonth(new Date('2021-4')).getDate(); // 30
 * getTheLastDateOfAMonth(new Date('2021-5')).getDate(); // 31
 * getTheLastDateOfAMonth(new Date('2021-6')).getDate(); // 30
 * getTheLastDateOfAMonth(new Date('2021-7')).getDate(); // 31
 * getTheLastDateOfAMonth(new Date('2021-8')).getDate(); // 31
 * getTheLastDateOfAMonth(new Date('2021-9')).getDate(); // 30
 * getTheLastDateOfAMonth(new Date('2021-10')).getDate(); // 31
 * getTheLastDateOfAMonth(new Date('2021-11')).getDate(); // 30
 * getTheLastDateOfAMonth(new Date('2021-12')).getDate(); // 31
 * getTheLastDateOfAMonth(new Date('2020-2')).getDate(); // 29
 *
 */
export function getTheLastDateOfAMonth(month: Date): Date {
  const lastDate = new Date(month.getTime());
  lastDate.setMonth(month.getMonth() + 1);
  lastDate.setDate(0);
  return lastDate;
}

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
  const endDate = getTheLastDateOfAMonth(month);

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

/**
 * 把天数、小时数，分钟数转换毫秒数
 *
 * @example
 *
 * const fn = t.getMilliseconds;
 *
 * fn(); // 0
 * fn({ seconds: 1 }); // 1000
 * fn({ seconds: 1.5 }); // 1500
 * fn({ seconds: 60 }); // 1000 * 60
 * fn({ minutes: 1 }); // 1000 * 60
 * fn({ minutes: 1.5 }); // 1000 * 90
 * fn({ minutes: 1 }); // === fn({ seconds: 60 })
 * fn({ minutes: 1.5 }); // === fn({ seconds: 90 })
 * fn({ hours: 1 }); // === fn({ minutes: 60 })
 * fn({ days: 1 }); // === fn({ hours: 24 })
 * fn({ days: 1.5 }); // === fn({ hours: 36 })
 *
 * @param [days=0]
 * @param [hours=0]
 * @param [minutes=0]
 * @param [seconds=0]
 */
export function getMilliseconds({
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
}: {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
} = {}): number {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;

  let result = seconds * second;
  result += minutes * minute;
  result += hours * hour;
  result += days * hour * 24;
  return result;
}

/**
 * 判断时间是否相同
 *
 * @example
 *
 * const date = new Date('2021-10-10');
 * const date2 = new Date('2021-10-30');
 *
 * isSameTime('yyyy-MM', date, date2); // true
 * isSameTime('yyyy-MM-dd', date, date2); // false
 * isSameTime('yyyy hh:mm:ss', date, date2); // true
 *
 * @param format yyyy-MM-dd hh:mm:ss
 * @param date
 * @param dates
 */
export function isSameTime(format: string, date: Date, ...dates: Date[]): boolean {
  const dt = formatDate(date, format);
  return dates.every((date) => formatDate(date, format) === dt);
}

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
  date,
  weekStart = 'Mon',
  now = new Date(),
}: {
  date: Date;
  weekStart?: 'Mon' | 'Sun';
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

/**
 * 计算两个日期间相差的年数 a - b
 *
 * @example
 *
 * yearDiff(new Date('2022-07-01'), new Date('2020-7-1')); // 2
 * yearDiff(new Date('2022-07-02'), new Date('2020-7-1')); // 2.002
 * yearDiff(new Date('2022-07-01'), new Date('2022-1-1')); // 0.5
 * yearDiff(new Date('2022-1-1'), new Date('2022-07-01')); // -0.5
 * yearDiff(new Date('2022-1-30'), new Date('2022-01-31')); // -0.002
 *
 * @param a
 * @param b
 * @returns {number}
 */
export function yearDiff(a: Date, b: Date): number {
  let months = a.getMonth() - b.getMonth();
  const years = a.getFullYear() - b.getFullYear();
  months += years * 12;

  const dates = a.getDate() - b.getDate();

  months += ~~((dates * 100) / (getTheLastDateOfAMonth(a).getDate() - 1)) / 100;

  return ~~((months * 1000) / 12) / 1000;
}

/**
 * 比如根据服务器与本地时间的差值计算实际日期
 *
 * @example
 *
 * const now = new Date();
 * const d = calcRelativeDate(now);
 *
 * d().getTime() === now.getTime(); // true
 *
 * await sleep(100);
 * now.getTime() + 90 <= d().getTime() && d().getTime() <= now.getTime() + 110; // true
 *
 * await sleep(100);
 * now.getTime() + 190 <= d().getTime() && d().getTime() <= now.getTime() + 210; // true
 *
 * @param init 服务器日期
 * @return {() => Date} 返回一个闭包，闭包返回实际日期，每次调用都返回实际日期
 */
export function calcRelativeDate(init: Date) {
  const diff = init.getTime() - Date.now();
  return () => new Date(Date.now() + diff);
}

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

  const timeConst = { millisecond, second, minute, hour, day, week, month, season, year } as const;
  return function () {
    return timeConst;
  };
})();

/**
 * 获取过去时间数
 * ---
 * 时间匹配顺序：年、季、月、周、天、时、分、秒
 *
 * @example
 * ```ts
 * const date = new Date('2023/4/7 00:00:00');
 * howLongAgo(date, { now: new Date('2023/4/7 00:00:20') }); // '20秒前'
 * howLongAgo(date, { now: new Date('2023/4/7 00:10:20') }); // '10分钟前'
 * howLongAgo(date, { now: new Date('2023/4/7 08:00:00') }); // '8小时前'
 * howLongAgo(date, { now: new Date('2023/4/10 00:00:00') }); // '3天前'
 *
 * howLongAgo(date, { now: new Date('2023/4/15 00:00:00') }); // '1周前'
 * howLongAgo(date, { now: new Date('2023/5/6 00:00:00') }); // '4周前'
 *
 * howLongAgo(date, { now: new Date('2023/5/7 00:00:00') }); // '1月前'
 * // 因为过去多少月是按天数算的，5月有31天，所以到6月6号已经是2月前了
 * howLongAgo(date, { now: new Date('2023/6/6 00:00:00') }); // '2月前'
 * howLongAgo(date, { now: new Date('2023/7/7 00:00:00') }); // '3月前'
 *
 * // 按天数算的，5月有31天，一季按91.25(365/4)天算
 * howLongAgo(date, { now: new Date('2023/7/8 00:00:00') }); // '1季前'
 *
 * howLongAgo(date, { now: new Date('2024/7/7 00:00:00') }); // '1年前'
 *
 * // now比date小
 * howLongAgo(date, { now: new Date('2022/7/8 00:00:00') }); // '2023-04-07 00:00:00'
 * howLongAgo(date, { now: new Date('2022/7/8 00:00:00'), def: '--' }); // '--'
 * howLongAgo(date, { now: new Date('2022/7/8 00:00:00'), defaultFormat: 'yyyy' }); // '2023'
 *
 * // 更换模板
 * const templates: Required<Parameters<typeof howLongAgo>>[1]['templates'] = {};
 *
 * // 更换秒数模板
 * templates.second = '刚刚';
 * howLongAgo(date, { now: new Date('2023/4/7 00:00:20'), templates }); // '刚刚'
 *
 * // 更换小时数模板
 * templates.hour = '${ago} hours ago';
 * howLongAgo(date, { now: new Date('2023/4/7 08:00:00'), templates }); // '8 hours ago'
 *
 * // 更换周数模板
 * templates.week = '${ago}星期前';
 * howLongAgo(date, { now: new Date('2023/4/15 00:00:00'), templates }); // '1星期前'
 * howLongAgo(date, { now: new Date('2023/5/6 00:00:00'), templates }); // '4星期前'
 *
 * // 去掉周数
 * templates.week = '~~';
 * howLongAgo(date, { now: new Date('2023/4/15 00:00:00'), templates }); // '8天前'
 * howLongAgo(date, { now: new Date('2023/5/6 00:00:00'), templates }); // '29天前'
 *
 * // 去掉季节
 * templates.season = '~~';
 * howLongAgo(date, { now: new Date('2023/7/8 00:00:00'), templates }); // '3月前'
 *
 * // ------- filter -------
 * // 使用filter替换季数
 * howLongAgo(date, {
 *   now: new Date('2023/10/8 00:00:00'),
 *   filter: (res, diff) =>
 *     res.endsWith('季前') ? ~~(diff / getTimePeriodConst().season) + ' seasons ago' : res,
 * }); // '2 seasons ago'
 *
 * // 混合
 * howLongAgo(date, {
 *   now: new Date('2023/4/7 02:10:00'),
 *   filter: (res, diff) => {
 *     if (res.endsWith('小时前')) {
 *       const tpc = getTimePeriodConst();
 *       return `${~~(diff / tpc.hour)}小时${~~((diff % tpc.hour) / tpc.minute)}分钟前`;
 *     }
 *     return res;
 *   },
 * }); // '2小时10分钟前'
 * ```
 *
 * @param date 过去的时间
 * @param {{}} options
 * @param options.now 当前时间；默认为new Date()
 * @param options.defaultFormat def参数${time}插槽的时间格式化模板；默认为'yyyy-MM-dd hh:mm:ss'
 * @param options.def 未匹配到模版时返回的模板，支持${time}插槽；默认为'${time}'
 * @param options.templates 匹配模板，支持${ago}插；当模板字符串为'~~'时会跳过该匹配模板，取自markdown的~~标记；默认为
 * {
 *   year: '${ago}年前',
 *   season: '${ago}季前',
 *   month: '${ago}月前',
 *   week: '${ago}周前',
 *   day: '${ago}天前',
 *   hour: '${ago}小时前',
 *   minute: '${ago}分钟前',
 *   second: '${ago}秒前',
 * }，传入模板时只会替换已填写部分模板
 * @param options.filter 过滤函数
 */
export function howLongAgo(
  date: Date,
  {
    now = new Date(),
    defaultFormat = 'yyyy-MM-dd hh:mm:ss',
    def = '${time}',
    templates,
    filter,
  }: {
    defaultFormat?: string;
    def?: string;
    filter?: (result: string, diff: number) => string;
    now?: Date;
    templates?: Partial<
      Record<keyof Omit<ReturnType<typeof getTimePeriodConst>, 'millisecond'> | 'now', string>
    >;
  } = {},
): string {
  const searchValue = '${ago}';
  const _templates: Required<typeof templates> = {
    now: '刚刚',
    year: `${searchValue}年前`,
    season: `${searchValue}季前`,
    month: `${searchValue}月前`,
    week: `${searchValue}周前`,
    day: `${searchValue}天前`,
    hour: `${searchValue}小时前`,
    minute: `${searchValue}分钟前`,
    second: `${searchValue}秒前`,
    ...templates,
  };

  const timePeriodConst = getTimePeriodConst();
  const matches: Array<[condition: number, template: string]> = (
    ['year', 'season', 'month', 'week', 'day', 'hour', 'minute', 'second'] satisfies Array<
      keyof typeof _templates
    >
  ).map((key) => [timePeriodConst[key], _templates[key]]);

  const _filter = filter || ((result) => result);
  const diff = now.getTime() - date.getTime();
  const found = matches.find(([cond, tpl]) => tpl !== '~~' && diff >= cond);

  if (!found) {
    if (diff >= 0 && diff < 1000) return _filter(_templates.now, diff);
    const res = def.replace('${time}', formatDate(date, defaultFormat));
    return _filter(res, diff);
  }

  const [condition, template] = found;
  const res = template.replace(searchValue, String(Math.floor(diff / condition)));
  return _filter(res, diff);
}
