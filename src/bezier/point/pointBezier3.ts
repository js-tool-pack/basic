import type { Point } from '@tool-pack/types';
import { bezier3 } from '../base';

/**
 * 三阶贝塞尔
 *
 * @example
 *
 * const bezierList = createArray({
 *   start: 0,
 *   end: 11,
 *   fill: (i) => Bezier.pointBezier3(i / 10, [1, 1], [2, 2], [8, 8], [10, 10]),
 * });
 *
 * // [
 * //   [1, 1],
 * //   [1.441, 1.441],
 * //   [2.128, 2.128],
 * //   [3.007, 3.007],
 * //   [4.024, 4.024],
 * //   [5.125, 5.125],
 * //   [6.256, 6.256],
 * //   [7.363, 7.363],
 * //   [8.392, 8.392],
 * //   [9.289, 9.289],
 * //   [10, 10],
 * // ];
 * bezierList;
 *
 * @param t 当前百分比
 * @param startPos 起点坐标
 * @param controlPoint1 控制点1
 * @param controlPoint2 控制点2
 * @param endPos 终点坐标
 */
export function pointBezier3(
  t: number,
  startPos: Point,
  controlPoint1: Point,
  controlPoint2: Point,
  endPos: Point,
) {
  const [x1, y1] = startPos;
  const [x2, y2] = endPos;
  const [cx1, cy1] = controlPoint1;
  const [cx2, cy2] = controlPoint2;
  return [bezier3(t, x1, cx1, cx2, x2), bezier3(t, y1, cy1, cy2, y2)];
}
