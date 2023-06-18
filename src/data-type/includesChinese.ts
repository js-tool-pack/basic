/**
 * 是否包含中文
 *
 * @example
 *
 * isIncludeChinese('哈'); // true
 * isIncludeChinese('哈水电费第三方'); // true
 * isIncludeChinese('哈水电费1第三方'); // true
 * isIncludeChinese('哈水电费.第三方'); // true
 * isIncludeChinese('哈水电费_第三方'); // true
 * isIncludeChinese('哈水电费 第三方'); // true
 * isIncludeChinese(''); // false
 * isIncludeChinese('1231'); // false
 * isIncludeChinese('-='); // false
 * isIncludeChinese(' '); // false
 * isIncludeChinese('$$%%'); // false
 */
export function includesChinese(value: string): boolean {
  return /[\u4e00-\u9fa5]/.test(value);
}
