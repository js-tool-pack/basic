import type { StrTemplate, TupleM2N, ToCamelCase } from '@tool-pack/types';

/**
 * 数字千位分隔
 *
 * Number.prototype.toLocaleString 也能转成千位分隔数字字符串
 *
 * @example
 *
 * // 小数位不转换
 * formatNumber(123456789); // '123,456,789'
 * formatNumber(123); // '123'
 * formatNumber(5763423); // '5,763,423'
 * formatNumber(123123.1111); // '123,123.1111'
 *
 * // 小数位转换
 * formatNumber(123.11, true); // '123.11'
 * formatNumber(123123.1111, true); // '123,123.111,1'
 * formatNumber(12312311.111111, true); // '12,312,311.111,111'
 * formatNumber(12312311.111111); // '12,312,311.111111'
 * formatNumber(12312311.111111, true, ' '); // '12 312 311.111 111'
 *
 * @param num
 * @param [isFormatDecimalPlaces=false] 是否格式化小数位
 * @param [delimiter = ","]
 */
export function formatNumber(
  num: string | number,
  isFormatDecimalPlaces = false,
  delimiter = ',',
): string {
  // 123123.1111 => 123,123.1,111
  // return String(num).replace(/\B(?=(?:\d{3})+(?!\d))/g, delimiter);
  const split = String(num).split('.') as TupleM2N<string, 1, 2>;
  split[0] = split[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, delimiter);
  if (split.length === 1 || !isFormatDecimalPlaces) return split.join('.');
  split[1] = split[1].replace(/(\d{3})/g, `$1${delimiter}`);
  return split.join('.').replace(new RegExp(`${delimiter}$`), '');
}

/**
 * 模仿c语言的模板字符串
 *
 * 目前只支持%s,给不能用``模板字符串的环境使用，像一些es5环境也可以用来事先准备好模板用于替换
 *
 * @overload 都是字符串的话ts提示会直接拼接好字符串
 *
 * @example
 *
 * strTemplate('1%s3', '2'); // '123'
 * strTemplate('hell%s worl%s', 'o', 'd'); // 'hello world'
 * strTemplate('hell%s worl%s'); // 'hell worl'
 *
 */
export function strTemplate<T extends string, S extends string[]>(
  str: T,
  ...params: S
): StrTemplate<T, S>;
/**
 * 模仿c语言的模板字符串
 *
 * 目前只支持%s,给不能用``模板字符串的环境使用，像一些es5环境也可以用来事先准备好模板用于替换
 *
 * @overload 这样的ts提示不准确，%s会变为类型而不是字面值
 *
 * @example
 *
 * ```ts
 * strTemplate('1%s%s86', 0, '0') // return: 10086;  // type alias: `1${number}${string}86`
 * ```
 *
 */
export function strTemplate<T extends string, S extends any[]>(
  str: T,
  ...params: S
): StrTemplate<T, S>;
export function strTemplate(str: string, ...params: any[]) {
  /*
    // es5; typescript不需要str, ...params参数`
    var args = Array.prototype.slice.call(arguments, 0);
    if (!args.length) return "";
    var str = args[0];
    var params = args.slice(1);
    */
  return (str as any).replace(/%s/g, function () {
    return params.length ? params.shift() : '';
  }) as any;
}

/**
 * 从字符串中删除指定字符串(from)中重复的第n(num)个字符串(str)
 *
 * @example
 *
 * removeStrByNum('123/456/78', 2, '/'); // '123/45678'
 * removeStrByNum('123,456,,78', 2, ','); // '123,456,78'
 * removeStrByNum('hello thank you i m fine', 4, ' '); // 'hello thank you im fine'
 *
 * @param from 原字符串
 * @param num 要移除的字符串出现的第几次
 * @param removeStr 要查找并移除的字符串
 */
export function removeStrByNum(from: string, num: number, removeStr: string): string {
  let times = 1;
  return String(from).replace(new RegExp(removeStr, 'g'), (v) => (times++ === num ? '' : v));
}

/**
 * 根据模板创建出字符串
 *
 * 除了面试题暂时找不到应用场景
 *
 * @example
 *
 * ```ts
 *  // 基础用法
 * smartRepeat('2[a]'); // 'aa'
 * smartRepeat('1[a]'); // 'a'
 *
 * // 无效数量
 * smartRepeat('[a]'); // '[a]'
 *
 * // 嵌套
 * smartRepeat('2[2[a]2[b]]'); // 'aabbaabb'
 * smartRepeat('2[2[a]2[b]2[c]]'); // 'aabbccaabbcc'
 * smartRepeat('2[2[a]2[bc]]'); // 'aabcbcaabcbc'
 * smartRepeat('2[2[a]77]'); // 'aa77aa77'
 * smartRepeat('2[1[1]2[2]3[2[5]2[6]]]'); // '122556655665566122556655665566'
 * smartRepeat('2[1[a]3[b]2[3[c]4[d]]]'); // 'abbbcccddddcccddddabbbcccddddcccdddd'
 * smartRepeat('2[1[1]3[b]2[1[1]4[d]]]'); // '1bbb1dddd1dddd1bbb1dddd1dddd'
 *
 * // 多余的]当普通字符处理
 * smartRepeat('2[2]]'); // '22]'
 *
 * // `[${string}]`前面非数字则保持原样
 * smartRepeat('2[b][2]'); // 'bb[2]'
 * // `[${string}]`前面是数字则补上前面的数字
 * smartRepeat('2[2][2]'); // '2222222222222222222222'
 * smartRepeat('2[2][2]').length; // 22
 *
 * ```
 */
export function smartRepeat(format: string): string {
  let exec;

  const re = /(\d+)\[([^[\]]+)](?!\d+\[)/;
  while ((exec = re.exec(format))) {
    const [, count, repeatValue] = exec;
    // 第一种方式
    format = format.replace(re, (repeatValue as string).repeat(Number(count)));
    // 第二种方式
    // const start = format.substring(0, exec.index);
    // const end = format.substring(exec.index + exec[0].length);
    // format = start + strRepeat(repeatValue, count) + end;
  }
  return format;
}

/**
 * 首字母大写
 *
 * @example
 *
 * capitalize('A'); // 'A'
 * capitalize('1'); // '1'
 * capitalize('ab'); // 'Ab'
 * capitalize('Ab'); // 'Ab'
 * capitalize('aa'); // 'Aa'
 * capitalize(''); // ''
 *
 */
export function capitalize<S extends string>(value: S): Capitalize<S> {
  if (!value.length) return value as any;
  const first = value[0] as string;
  return `${first.toUpperCase()}${value.substring(1).toLowerCase()}` as any;
}

/**
 * 从驼峰转其他命名格式
 *
 * @example
 *
 *  // 默认下划线分割
 * fromCamel('a'); // 'a'
 * fromCamel('A'); // 'a'
 * fromCamel('Test'); // 'test'
 * fromCamel('TEST'); // 'test'
 * fromCamel('testCamel'); // 'test_camel'
 * fromCamel('TestCamelString'); // 'test_camel_string'
 * fromCamel('TestCamelSTring'); // 'test_camel_string'
 *
 * // 自定义分割字符
 * fromCamel('TestCamelSTring', '-'); // 'test-camel-string'
 *
 * // 转大写
 * fromCamel('TestCamelSTring', '-', true); // 'TEST-CAMEL-STRING'
 *
 * @param {string} value
 * @param [delimiter='_'] 默认'_'
 * @param [toUpperCase=false] // 为true时 转为全大写的格式
 */
export function fromCamel(value: string, delimiter = '_', toUpperCase = false) {
  const res = value.replace(/([A-Z]+)/g, (_p1, p2, index) => {
    return (index > 0 ? delimiter : '') + p2.toLowerCase();
  });
  return toUpperCase ? res.toUpperCase() : res;
}

/**
 * 其他转驼峰
 *
 * @example
 *
 * expect(toCamel('A')).toBe('a');
 * // 转大驼峰
 * toCamel('A', undefined, true); // 'A'
 *
 * toCamel('a'); // 'a'
 * // 转大驼峰
 * toCamel('a', undefined, true); // 'A'
 *
 * toCamel('1'); // '1'
 *
 * toCamel('ab'); // 'ab'
 * // 转大驼峰
 * toCamel('ab', undefined, true); // 'Ab'
 *
 * // 默认选项
 * toCamel('aa_bb'); // 'aaBb'
 * toCamel('test_camel_string'); // 'testCamelString'
 * toCamel('test__camel_string'); // 'testCamelString'
 *
 * // 默认分隔符，转大驼峰
 * toCamel('test_camel_string', undefined, true); // 'TestCamelString'
 *
 * // 正则匹配分隔符
 * toCamel('test-camel_string', /[-_]/); // 'testCamelString'
 *
 * // edge
 * toCamel('', ''); // ''
 *
 * @param {string} value
 * @param {string | RegExp} delimiter
 * @param {boolean} toUpperCamelCase
 */
export function toCamel<
  S extends string,
  D extends string | RegExp = '_',
  U extends boolean = false,
>(
  value: S,
  delimiter: D = '_' as D,
  toUpperCamelCase: U = false as U,
): D extends string
  ? U extends true
    ? Capitalize<ToCamelCase<S, D>>
    : ToCamelCase<S, D>
  : string {
  if (!value.length) return value as any;
  const reg = typeof delimiter === 'string' ? new RegExp(delimiter + '+') : (delimiter as RegExp);
  const join = value.split(reg).map((i) => capitalize(i) as string);

  if (!toUpperCamelCase && join.length) {
    join[0] = (join[0] as string).toLowerCase();
  }
  return join.join('') as any;
}

/**
 * 获取字符串实际长度
 *
 * String.prototype.length获取的是utf-16的长度
 *
 * @example
 *
 * const str = '😂👱👬👨‍👩‍👧👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👧👩‍👧‍👧; // 8个表情，包含组合表情
 * console.log(str.length); // 49
 * console.log(getStringLen(str)); // 8
 *
 * const str2 = '🙎🏿'; // 黑皮肤表情
 * console.log(str2.length); // 4
 * console.log(getStringLen(str2)); // 1
 *
 * @param value 要获取长度的字符串
 * @returns 字符串实际长度
 */
export function getStringLen(value: string): number {
  /*
  // https://www.zhihu.com/question/38324041
  // underscore.js toArray
  // const reg = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;

  // 参考 https://juejin.cn/post/6941276804472635405
  // '😂1👱1👬1👨‍👩‍👧1👨‍👩‍👧‍👦23'.split('')
  // 8205 是通过 [...'👨‍👩‍👧‍👦123123123'].forEach((v) => console.log(v.codePointAt(0))); 获取的
  // const emojiDelimiter = String.fromCodePoint(8205); // emoji分隔符：该字符看上去很像空格
  const emojiDelimiter = '\u200D'; // (8205).toString(16)
  const symbol = '[\ud800-\udbff][\udc00-\udfff]';

  // 👱🏼‍👱🏿‍皮肤颜色 参考 https://zhuanlan.zhihu.com/p/328516890
  const skinColor = '\ud83c[\udffc-\udfff]';

  return (
    value
      // 先匹配组合表情符号
      .replace(new RegExp(`${symbol}(${emojiDelimiter}${symbol})+`, 'g'), '_')
      // 再匹配有皮肤的表情符号
      .replace(new RegExp(`${symbol}${skinColor}`, 'g'), '_')
      // 然后匹配普通表情符号
      .replace(new RegExp(symbol, 'g'), '_').length
  );
  */

  // 使用内置对象Intl.Segmenter按字形分割字符串
  const segmenter = new Intl.Segmenter('fr', { granularity: 'grapheme' });
  return Array.from(segmenter.segment(value)).length;
}
