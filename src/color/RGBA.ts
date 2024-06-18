import type { Tuple } from '@tool-pack/types';
import { randomInt } from '../random';
import { RGBSuper } from './RGBSuper';
import { RGB } from './RGB';

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
  private _a!: number;

  constructor(r?: number, g?: number, b?: number, a = 1) {
    super(r, g, b);
    this.a = a;
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
   * 随机RGBA
   */
  static random(): RGBA {
    const num = randomInt(0, 255, 3);
    return new RGBA(num[0], num[1], num[2], randomInt());
  }

  /**
   * 转成字符串
   */
  toString() {
    const { r, g, b, a } = this;
    return `rgba(${r},${g},${b},${a})`;
  }

  /**
   * 转成RGB
   */
  toRGB(): RGB {
    const { r, g, b } = this;
    return new RGB(r, g, b);
  }

  /**
   * 设置RGBA中的A
   */
  set a(value: number) {
    const a = Math.max(0, Math.min(value, 1));
    this._a = Number(a.toFixed(2));
  }

  /**
   * 获取RGBA中的A
   */
  get a(): number {
    return this._a;
  }
}
