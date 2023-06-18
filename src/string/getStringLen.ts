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
  const segmenter = new Intl.Segmenter('fr', {
    granularity: 'grapheme',
  });
  return Array.from(segmenter.segment(value)).length;
}
