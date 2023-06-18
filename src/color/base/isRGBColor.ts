/**
 * 判断是否是RGB(包含RGBA)格式的颜色值
 *
 * @example
 *
 * isRGBColor('rgb(0,0,0)'); // true
 * isRGBColor('rgb(0, 0, 0)'); // true
 * isRGBColor('rgba(0,0,0,0)'); // true
 * isRGBColor('rgba(255,255,255,0)'); // true
 * isRGBColor('rgba(255, 255, 255, 0)'); // true
 * isRGBColor('rgba(100,100,255,0.123123)'); // true
 *
 * isRGBColor('rgba(-1,0,0,1)'); // false
 * isRGBColor('rgba(0,-1,0,1)'); // false
 * isRGBColor('rgba(0,0,-1,1)'); // false
 * isRGBColor('rgba(0,0,0,-1)'); // false
 * isRGBColor('rgba(.,.,.,.)'); // false
 */
export function isRGBColor(color: string) {
  const reg =
    /^[rR][gG][Bb][Aa]?\((\s*(2[0-4]\d|25[0-5]|[01]?\d{1,2}),){2}\s*(2[0-4]\d|25[0-5]|[01]?\d{1,2})(,\s*(0\.\d+|1|0))?\)$/;
  return reg.test(color);
}
