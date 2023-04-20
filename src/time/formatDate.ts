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
    'M+': () => date.getMonth() + 1,
    //月份
    'd+': () => date.getDate(),
    //日
    'h+': () => date.getHours(),
    //小时
    'm+': () => date.getMinutes(),
    //分
    's+': () => date.getSeconds(),
    //秒
    q: () => {
      //季度
      // 按月份区分的季度并不真的准确
      // 春季为3-5月，夏季为6-8月、秋季为9-11月、冬季为12-2月
      const month = date.getMonth() + 1;
      const qIndex = opt.seasonRanges.findIndex((range) => range.includes(month));
      return opt.seasonNames[qIndex];
    },
    'S+': () => date.getMilliseconds(),
    //毫秒
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
