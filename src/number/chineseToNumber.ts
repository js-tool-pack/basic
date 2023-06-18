import { Tuple } from '@tool-pack/types';

/**
 * 中文转为阿拉伯数字
 * ---
 * @throws new TypeError('发现不符合规则的字符(必须在units和numbers里存在的字符):')
 * @param value 中文数字
 * @param {{}} options 可选参数
 * @param [options.units=['', '十', '百', '千', '万', '十', '百', '千', '亿']] 单位
 * @param [options.numbers=['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']] 数字映射
 */
export function chineseToNumber(
  value: string,
  options: {
    units?: string[];
    numbers?: Tuple<string, 10>;
  } = {},
) {
  const {
    numbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    units = ['', '十', '百', '千', '万', '十', '百', '千', '亿'],
  } = options;
  if (new RegExp(`([^${units.join() + numbers.join()}])`).test(value)) {
    throw new TypeError('发现不符合规则的字符(必须在units和numbers里存在的字符):' + RegExp.$1);
  }

  // 用万和亿分割
  const arr = value.split(new RegExp(`[${units[4]}${units[8]}]`, 'g'));
  const numberArr = arr.map((it) => {
    let res = 0;
    let unit = 1;
    // 从个位数往大数累加
    for (let i = it.length - 1; i > -1; i--) {
      const item = it[i] as string;
      const number = numbers.indexOf(item);
      if (number > 0) {
        res += number * unit;
      }
      const unitIndex = units.indexOf(item);
      unit = unitIndex > 0 ? 10 ** unitIndex : unit;
    }

    // 以十开头的要单独列出来 例如十一完全体是一十一
    if (it[0] === units[1]) {
      res += 10;
    }
    return res;
  });

  // 把分割开的数字拼接回去
  return numberArr.reverse().reduce((res, item, index) => {
    return res + 10000 ** index * item;
  }, 0);
}
