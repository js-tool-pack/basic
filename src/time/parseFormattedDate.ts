/**
 * 解析格式化后的日期字符串
 *
 * @example
 *
 * const parse = (...args: Parameters<typeof parseFormattedDate>): string => formatDate(parseFormattedDate(...args));
 *
 * parse('2019-12-12 10:10:10'); // '2019-12-12 10:10:10'
 * parse('2019-12-12'); // '2019-12-12 00:00:00'
 * parse('2019年12月12日', 'yyyy年MM月dd日'); // '2019-12-12 00:00:00'
 *
 * // 注意日期一定要跟格式一一对应，否则会出现以下不符合规范的日期
 * parse('12月12日', 'yyyy年MM月dd日'); // '0120-12-01 00:00:00'
 *
 * parse('2023-12'); // '2023-12-01 00:00:00'
 *
 * @param date 日期字符串
 * @param formular 格式
 */
export function parseFormattedDate(
  date: string,
  formular: string = 'yyyy-MM-dd hh:mm:ss:SSS',
): Date {
  const len = formular.length;
  const obj: Partial<Record<keyof typeof LegalCharacter, string>> = {};

  for (let i = 0; i < len; i++) {
    const f = formular[i] as keyof typeof LegalCharacter | undefined;
    const d = date[i];

    if (!f || !d) continue;
    if (!LegalCharacter[f] || !/\d/.test(d)) continue;

    obj[f] = (obj[f] || '') + (d || '');
  }

  return new Date(
    Number(obj.y || '0'),
    Number(obj.M || '0') - 1,
    Number(obj.d || '1'),
    Number(obj.h || '0'),
    Number(obj.m || '0'),
    Number(obj.s || '0'),
    Number(obj.S || '0'),
  );
}

const LegalCharacter = {
  y: true,
  M: true,
  d: true,
  h: true,
  m: true,
  s: true,
  S: true,
};
