import { inRanges } from '../array';

/**
 * 判断字符串内是否全部都是 ascii 标点符号
 *
 * 空格不算特殊符号，总共 32 个标点符号
 *
 *
 * @example
 *
 * isASCIIPunctuationSymbol('1'); // false
 * isASCIIPunctuationSymbol('a'); // false
 * isASCIIPunctuationSymbol('A'); // false
 * isASCIIPunctuationSymbol(' '); // false
 * isASCIIPunctuationSymbol('&'); // true
 * isASCIIPunctuationSymbol('&^%%$'); // true
 * isASCIIPunctuationSymbol('&sdf'); // false
 */
export function isASCIIPunctuationSymbol(value: string): boolean {
  const len = value.length;
  if (!len) return false;

  for (let i = 0; i < len; i++) {
    if (!inRanges(value.charCodeAt(i), [33, 47], [58, 64], [91, 96], [123, 126])) return false;
  }

  return true;
}
