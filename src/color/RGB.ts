import type { Tuple } from '@tool-pack/types';
import { isArray } from '../data-type';
import { randomInt } from '../random';
import { RGBSuper } from './RGBSuper';
import { RGBA } from './RGBA';

/**
 * RGB类
 *
 * @example
 *
 * const rgb = new RGB(255,255,255);
 * rgb.toString(); // 'rgb(255,255,255)'
 *
 * const randomRGB = RGB.random();
 *
 * const fromStr = RGB.fromStr('rgb(255,255,255)');
 *
 * const fromHex = RGB.fromHEX('#fff');
 */
export class RGB extends RGBSuper {
  constructor(r?: number, g?: number, b?: number) {
    super(r, g, b);
  }

  /**
   * 从HEX颜色值转换而来
   */
  static fromHEX(hexColor: string): RGB {
    const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const hex = hexColor.replace(rgx, (_m, r, g, b) => r + r + g + g + b + b);
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) as string[];
    if (!isArray(rgb) || rgb.length < 4) throw new TypeError();
    const r = parseInt(rgb[1] as string, 16);
    const g = parseInt(rgb[2] as string, 16);
    const b = parseInt(rgb[3] as string, 16);
    return new RGB(r, g, b);
  }

  /**
   * 从字符串转换而来
   */
  static fromStr(color: string) {
    if (!RGB.validate(color)) throw new TypeError('color is not rgb');
    color = color.replace(/(rgba?\(|\))/g, '');
    const rgb = color.split(',') as Tuple<string, 3>;
    const r = parseInt(rgb[0]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2]);
    return new RGB(r, g, b);
  }

  /**
   * 随机颜色
   */
  static random(): RGB {
    const num = randomInt(0, 255, 3);
    return new RGB(num[0], num[1], num[2]);
  }

  /**
   * 转换为字符串
   */
  toString(): string {
    const { r, g, b } = this;
    return `rgb(${r},${g},${b})`;
  }

  /**
   * 转换为RGBA
   */
  toRGBA(): RGBA {
    const { r, g, b } = this;
    return new RGBA(r, g, b);
  }
}
