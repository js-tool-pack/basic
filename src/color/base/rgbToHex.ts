import { isRGBColor } from './isRGBColor';

/**
 * RGB转换为HEX
 *
 * @example
 *
 * rgbToHex('rgb(0,0,0)'); // '#000000'
 * rgbToHex('rgb(132,7,7)'); // '#840707'
 * rgbToHex('rgb(101,77,77)'); // '#654d4d'
 *
 * @throws TypeError 当检测到不合格的颜色值时抛出error
 *
 */
export function rgbToHex(color: string) {
  if (!isRGBColor(color)) throw new TypeError();
  const rgb = color.split(',') as [string, string, string];
  const r = parseInt(rgb[0].split('(')[1] as string);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2].split(')')[0] as string);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// 移动到RGB.fromHEX
/*export function hexToRgb(hexValue: string) {
    // if (!isHEXColor(hexValue)) throw new TypeError("hexValue is not hex color");
    const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const hex = hexValue.replace(rgx, (m, r, g, b) => {
        return r + r + g + g + b + b;
    });
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) as string[];
    if (!isArray(rgb) || rgb.length < 4) throw new TypeError();
    const r = parseInt(rgb[1], 16);
    const g = parseInt(rgb[2], 16);
    const b = parseInt(rgb[3], 16);
    return `rgb(${r},${g},${b})`;
}*/
