/**
 * 判断是否是HEX格式的颜色值
 *
 * @example
 *
 * isHEXColor('#ffffff'); // true
 * isHEXColor('#fff'); // true
 * isHEXColor('#ffff'); // false
 * isHEXColor('#fffff'); // false
 * isHEXColor('#FFFFFF'); // true
 * isHEXColor('#7d1919'); // true
 * isHEXColor('#7D1919'); // true
 * isHEXColor('#7d19199'); // false
 * isHEXColor('#7d191g'); // false
 * isHEXColor('rgba(0,0,266,2)'); // false
 *
 */
export function isHEXColor(color: string) {
  const reg = /^#([\da-fA-F]{3}){1,2}$/;
  return reg.test(color);
}
