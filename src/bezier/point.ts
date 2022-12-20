import { Point } from '../coordinate';
import { bezier2 } from './base';

/**
 * 生成二阶贝塞尔曲线路径点
 *
 * @example
 *
 * const bezierList = createArray({
 *   start: 0,
 *   end: 11,
 *   fill: (i) => pointBezier2(i / 10, [1, 1], [10, 10], [10, 10]),
 * });
 *
 * // [
 * //   [1, 1],
 * //   [2.7100000000000004, 2.7100000000000004],
 * //   [4.240000000000001, 4.240000000000001],
 * //   [5.59, 5.59],
 * //   [6.760000000000001, 6.760000000000001],
 * //   [7.75, 7.75],
 * //   [8.559999999999999, 8.559999999999999],
 * //   [9.19, 9.19],
 * //   [9.64, 9.64],
 * //   [9.91, 9.91],
 * //   [10, 10],
 * // ]
 * bezierList;
 *
 * @param t 当前百分比，范围：0-1
 * @param startPos 起点坐标
 * @param controlPoint 控制点
 * @param endPos 终点坐标
 */
export function pointBezier2(
  t: number,
  startPos: Point,
  controlPoint: Point,
  endPos: Point,
): Point {
  const [x1, y1] = startPos;
  const [cx, cy] = controlPoint;
  const [x2, y2] = endPos;
  // const x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
  // const y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
  return [bezier2(t, x1, cx, x2), bezier2(t, y1, cy, y2)];
}
