/**
 * 变量命名法通用切割正则
 *
 * ascii标点字符定义见该页面
 * @see {@link https://www.kerryr.net/pioneers/ascii3.htm}
 */
export const CaseSplitRegExp = /[\s!-/:-@[-`{-~]+|(?<![A-Z])(?=[A-Z])/g;
