import { randomInt } from './randomInt';

/**
 * 随机HEX颜色
 *
 * @example
 *
 * randomHEX(); // '#[0-9a-f]{6}'
 *
 */
export function randomHEX(): string {
  const num = randomInt(0xffffff).toString(16);
  return '#' + num.padStart(6, '0');
}
