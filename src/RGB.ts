import { Tuple } from '@tool-pack/types';
import { isRGBColor } from './color';
import { randomInt } from './random';
import { isArray } from './data-type';
import { getSafeNum } from './number';

function getLimitValue(value: number) {
  return getSafeNum(value, 0, 255);
}

abstract class RGBSuper {
  protected _r!: number;
  protected _g!: number;
  protected _b!: number;

  protected constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  /**
   * 获取RGB中的R
   */
  get r(): number {
    return this._r;
  }

  /**
   * 设置RGB中的R
   */
  set r(value: number) {
    this._r = getLimitValue(value);
  }

  /**
   * 获取RGB中的G
   */
  get g(): number {
    return this._g;
  }

  /**
   * 设置RGB中的G
   */
  set g(value: number) {
    this._g = getLimitValue(value);
  }

  /**
   * 获取RGB中的B
   */
  get b(): number {
    return this._b;
  }

  /**
   * 设置RGB中的B
   */
  set b(value: number) {
    this._b = getLimitValue(value);
  }

  abstract toString(): string;

  /**
   * 校验颜色值
   *
   * @see isRGBColor
   */
  static validate = isRGBColor;

  /**
   * 转换为HEX颜色值
   */
  toHEX(): string {
    const { r, g, b } = this;
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}

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
   * 随机颜色
   */
  static random(): RGB {
    const num = randomInt(0, 255, 3);
    return new RGB(num[0], num[1], num[2]);
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
   * 转换为RGBA
   */
  toRGBA(): RGBA {
    const { r, g, b } = this;
    return new RGBA(r, g, b);
  }

  /**
   * 转换为字符串
   */
  toString(): string {
    const { r, g, b } = this;
    return `rgb(${r},${g},${b})`;
  }
}

/**
 * RGBA类
 *
 * @example
 *
 * const rgba = new RGBA(255,255,255,0.2);
 *
 * rgba.toString(); // 'rgba(255,255,255,0.2)'
 *
 * const randomRGBA = RGBA.random();
 *
 * const fromStr = RGBA.fromStr('rgba(255,255,255,0.2)');
 *
 * cons fromRGB = RGB.random().toRGBA();
 *
 */
export class RGBA extends RGBSuper {
  constructor(r?: number, g?: number, b?: number, a = 1) {
    super(r, g, b);
    this.a = a;
  }

  private _a!: number;

  /**
   * 获取RGBA中的A
   */
  get a(): number {
    return this._a;
  }

  /**
   * 设置RGBA中的A
   */
  set a(value: number) {
    const a = Math.max(0, Math.min(value, 1));
    this._a = Number(a.toFixed(2));
  }

  /**
   * 随机RGBA
   */
  static random(): RGBA {
    const num = randomInt(0, 255, 3);
    return new RGBA(num[0], num[1], num[2], randomInt());
  }

  /**
   * 从字符串中转换而来
   */
  static fromStr(color: string): RGBA {
    if (!RGBA.validate(color)) throw new TypeError('color is not rgb');
    color = color.replace(/(rgba?\(|\))/g, '');
    const rgb = color.split(',') as Tuple<string, 4>;
    const r = parseInt(rgb[0]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2]);
    const a = parseInt(rgb[3]);
    return new RGBA(r, g, b, a);
  }

  /**
   * 转成RGB
   */
  toRGB(): RGB {
    const { r, g, b } = this;
    return new RGB(r, g, b);
  }

  /**
   * 转成字符串
   */
  toString() {
    const { r, g, b, a } = this;
    return `rgba(${r},${g},${b},${a})`;
  }
}
