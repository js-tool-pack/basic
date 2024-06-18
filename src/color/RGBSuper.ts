import { getSafeNum } from '../number';
import { isRGBColor } from './base';

function getLimitValue(value: number) {
  return getSafeNum(value, 0, 255);
}

export abstract class RGBSuper {
  /**
   * 校验颜色值
   *
   * @see isRGBColor
   */
  static validate = isRGBColor;
  protected _r!: number;
  protected _g!: number;

  protected _b!: number;

  protected constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  /**
   * 转换为HEX颜色值
   */
  toHEX(): string {
    const { r, g, b } = this;
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * 设置RGB中的R
   */
  set r(value: number) {
    this._r = getLimitValue(value);
  }

  /**
   * 设置RGB中的G
   */
  set g(value: number) {
    this._g = getLimitValue(value);
  }

  /**
   * 设置RGB中的B
   */
  set b(value: number) {
    this._b = getLimitValue(value);
  }

  /**
   * 获取RGB中的R
   */
  get r(): number {
    return this._r;
  }

  /**
   * 获取RGB中的G
   */
  get g(): number {
    return this._g;
  }

  /**
   * 获取RGB中的B
   */
  get b(): number {
    return this._b;
  }

  abstract toString(): string;
}
