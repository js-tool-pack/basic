// import { isASCIIPunctuationSymbol } from '../../data-type';
// import { inRange } from '../../array';
import { CaseSplitRegExp } from './regexp';

/**
 * 其他变量命名风格转小写加中划线
 *
 * @example
 *
 * kebabCase('aBBcde-fFF__g   h'); // 'a-bbcde-f-ff-g-h'
 * kebabCase('APPStyle'); 'appstyle'
 * kebabCase('APP_Style'); 'app-style'
 * kebabCase('abc0Abc0'); // 'abc0-abc0'
 * kebabCase('AUV'); // 'auv'
 * kebabCase(' Auv'); // 'auv'
 *
 */
export function kebabCase(value: string): string {
  if (!value) return value;

  // --- 正则写法 ---
  return value
    .split(CaseSplitRegExp)
    .map((w) => w.toLowerCase())
    .filter(Boolean)
    .join('-');

  // // --- 遍历写法 理论上会快一点(理论上)，兼容性也好一点(没有正则的前瞻) ---
  // const len = value.length;
  // const separator = '-';
  // const upRange = ['A'.charCodeAt(0), 'Z'.charCodeAt(0)] as const;
  // let result = '';
  //
  // const isUpperCase = (char: string) => inRange(char.charCodeAt(0), upRange);
  //
  // for (let i = 0, _separator = '', prevIsUpperCase = false; i < len; i++) {
  //   let word = value[i] as string;
  //
  //   if (isUpperCase(word)) {
  //     // 连起来的大写字母只能有一个分隔符
  //     if (!prevIsUpperCase) _separator = separator;
  //     prevIsUpperCase = true;
  //     word = word.toLowerCase();
  //   } else {
  //     prevIsUpperCase = false;
  //     if (word === ' ' || isASCIIPunctuationSymbol(word)) {
  //       _separator = separator;
  //       continue;
  //     }
  //   }
  //
  //   // 开头不能是分隔符
  //   result += (result.length ? _separator : '') + word;
  //   _separator = '';
  // }
  //
  // return result;
}
