import type { Point } from '@tool-pack/types';
import { inRange } from '../array';

/**
 * 判断某个点是否在某个线上
 *
 * @example
 *
 * isPointInPath([1, 2], [[0, 0], [2, 4]]); // true
 * isPointInPath([2, 2], [[0, 0], [2, 4]]); // false
 *
 * isPointInPath([2, 2], [[0, 0], [4, 4]]); // true
 * isPointInPath([1, 2], [[0, 0], [4, 4]]); // false
 * isPointInPath([1, 2], [[0, 0], [2, 4], [4, 4]]); // true
 *
 * isPointInPath([3, 3], [[1, 1], [4, 4]]); // true
 *
 * @param point 点
 * @param path 路径、线
 */
export function isPointInPath(point: Point, path: Point[]): boolean {
  const [x, y] = point;
  for (let i = 1; i < path.length; i++) {
    const [x1, y1] = path[i - 1] as Point;
    const [x2, y2] = path[i] as Point;

    // 根据向量的坐标运算  判断是否平行
    // 对于非0向量a,b 设a=(x1,y1) b=(x2,y2) 则a平行b <=>  x1/x2 = y1/y2
    const vector1 = (y2 - y1) / (x2 - x1);
    const vector2 = (y - y1) / (x - x1);

    // 判断是否在范围内
    if (vector2 === vector1 && inRange(x, [x1, x2]) && inRange(y, [y1, y2])) return true;
  }
  return false;
}
