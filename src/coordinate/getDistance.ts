import type { Point } from './Point';

/**
 * 根据三角函数求两点的距离
 *
 * @example
 *
 * getDistance([0, 0], [3, 4]); // 5
 * getDistance([0, 0], [1, 1]); // Math.sqrt(2)
 * Math.round(getDistance([0, 0], [1, Math.sqrt(3)])); // 2
 *
 * getDistance([0, 0], [0, 5]); // 5
 * getDistance([0, 0], [5, 0]); // 5
 * getDistance([0, 0], [-5, 0]); // 5
 * getDistance([0, 0], [0, -5]); // 5
 *
 */
export function getDistance(origin: Point, target: Point): number {
  const [x1, y1] = origin;
  const [x2, y2] = target;
  const x = x1 - x2;
  const y = y1 - y2;
  return Math.sqrt(x * x + y * y);
}
