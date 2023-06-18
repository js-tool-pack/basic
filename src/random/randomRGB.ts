import { randomInt } from './randomInt';

/**
 * 随机RGB颜色
 *
 * @example
 *
 * randomRGB(); // 'rgb([0-255], [0-255], [0-255])'
 *
 */
export function randomRGB(): string {
  const num = randomInt(0, 255, 3);
  return `rgb(${num[0]},${num[1]},${num[2]})`;
}
