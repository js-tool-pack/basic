import { isASCIIPunctuationSymbol } from '../../data-type';
import { inRange } from '../../array';

/**
 * 把各种变量风格的字符串分割成字符串数组
 *
 * @example
 *
 * splitByCases('helloWorld'); // ['hello', 'World']
 * splitByCases('hello-World'); // ['hello', 'World']
 * splitByCases('HelloWorld'); // ['Hello', 'World']
 * splitByCases(' _-hello-_ World_=- '); // ['hello', 'World']
 */
export function splitByCases(value: string): string[] {
  // 后面一大堆代码其实就相当于这一行正则，但是该正则使用了'前瞻后顾'，在safari上不兼容，所以还是手动实现
  /**
   * 变量命名法通用切割正则
   *
   * ascii标点字符定义见该页面
   * @see {@link https://www.kerryr.net/pioneers/ascii3.htm}
   */
  // return value.split(/[\s!-/:-@[-`{-~]+|(?<![A-Z])(?=[A-Z])/g).filter(Boolean);

  const len = value.length;
  const separator = '-';
  const upRange = ['A'.charCodeAt(0), 'Z'.charCodeAt(0)] as const;
  const result = [];
  let word = '';

  const isUpperCase = (char: string) => inRange(char.charCodeAt(0), upRange);

  for (let i = 0, _separator = '', prevIsUpperCase = false; i < len; i++) {
    const char = value[i] as string;

    if (isUpperCase(char)) {
      // 连起来的大写字母只能有一个分隔符
      if (!prevIsUpperCase) _separator = separator;
      prevIsUpperCase = true;
    } else {
      prevIsUpperCase = false;
      if (char === ' ' || isASCIIPunctuationSymbol(char)) {
        _separator = separator;
        continue;
      }
    }

    if (_separator.length && word.length) {
      result.push(word);
      word = '';
    }
    _separator = '';
    word += char;
  }
  word.length && result.push(word);

  return result;
}
