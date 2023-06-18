import { isNumber } from '../data-type';
import { randomHEX } from './randomHEX';
import { randomRGB } from './randomRGB';
import { randomRGBA } from './randomRGBA';
import { createArray } from '../array';

/**
 * 随机颜色，无参数时默认为HEX格式的颜色
 *
 * @see randomHEX
 *
 * @example
 *
 * randomColor(); // '#[0-9a-f]{6}'
 */
export function randomColor(): string;
/**
 * 随机类型颜色
 *
 * @see randomHEX
 * @see randomRGB
 * @see randomRGBA
 *
 * @example
 *
 * // 随机HEX颜色
 * randomColor('HEX');
 * // 随机RGB颜色
 * randomColor('RGB');
 * // 随机RGBA颜色
 * randomColor('RGBA');
 *
 */
export function randomColor(type: 'HEX' | 'RGB' | 'RGBA'): string;
/**
 * 生成HEX颜色数组
 */
export function randomColor(len: number): string[];
/**
 * 生成 'HEX' | 'RGB' | 'RGBA' 颜色数组
 */
export function randomColor(type: 'HEX' | 'RGB' | 'RGBA', len: number): string[];
export function randomColor(type?: string | number, len?: number): string[] | string {
  if (isNumber(type)) {
    len = type;
    type = 'HEX';
  }
  if (type === undefined) {
    type = 'HEX';
  }
  type = type.toUpperCase();
  if (len === undefined) {
    const map = {
      HEX: randomHEX,
      RGB: randomRGB,
      RGBA: randomRGBA,
    };
    return (map[type as keyof typeof map] || map.HEX)();
  } else {
    return createArray({
      len,
      fill: () => randomColor(type as 'HEX' | 'RGB' | 'RGBA'),
    });
  }
}
