import type { Tuple } from '@tool-pack/types';

/**
 * 阿拉伯数字转为中文数字
 * @param value 数字
 * @param {{}} options 可选参数
 * @param [options.units=['', '十', '百', '千', '万', '十', '百', '千', '亿']] 单位
 * @param [options.numbers=['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']] 数字映射
 */
export function numberToChinese(
  value: number,
  options: {
    numbers?: Tuple<string, 10>;
    units?: string[];
  } = {},
): string {
  const {
    numbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    units = ['', '十', '百', '千', '万', '十', '百', '千', '亿'],
  } = options;
  const unitLen = units.length;
  let key = ~~value;
  let chineseNumber = '';
  let times = 0;

  // 个位数
  if (value >= 0 && value < 10) return numbers[value] as string;
  while (key >= 1 && times < unitLen) {
    const unit = units[times];
    // 11 % 10 => 一
    const end = numbers[key % 10];
    // 101 0没有单位
    if (end !== numbers[0]) {
      chineseNumber = unit + chineseNumber;
    }
    // 11 => 一十一 => 十一
    if (!(key === 1 && times === 1)) {
      chineseNumber = end + chineseNumber;
    }
    key = ~~(key / 10);
    times++;
  }
  // 一万零零一 => 一万零一 | 一万零零零 => 一万
  return chineseNumber.replace(/(零+$)|((零)\3+)/g, '$3');
}
