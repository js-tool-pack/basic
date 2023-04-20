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
  const obj: {
    [k: string]: number;
  } = {
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
