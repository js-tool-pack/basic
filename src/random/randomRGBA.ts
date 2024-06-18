import { randomFloat } from './randomFloat';
import { randomInt } from './randomInt';

/**
 * 随机RGBA颜色
 *
 * @example
 *
 * randomRGBA(); // 'rgb([0-255], [0-255], [0-255], [0-1])'
 *
 */
export function randomRGBA(): string {
  const num = randomInt(0, 255, 3);
  const opacity = +randomFloat().toFixed(2);
  return `rgba(${num[0]},${num[1]},${num[2]},${opacity})`;
}
