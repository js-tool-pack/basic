import { Point } from '../coordinate';
import { bezier2, bezier3 } from './base';
import { getYangHuiTriangleOne } from '../array';
import { strip } from '../number';

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
 * //   [2.71, 2.71],
 * //   [4.24, 4.24],
 * //   [5.59, 5.59],
 * //   [6.76, 6.76],
 * //   [7.75, 7.75],
 * //   [8.56, 8.56],
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

/**
 * n阶贝塞尔曲线
 * ---
 * 由于要取杨辉三角以及累加，性能没有固定阶数的好
 *
 * @param t 百分比
 * @param points 贝塞尔曲线控制点坐标
 */
export function pointBezierN(t: number, ...points: Point[]): Point | null {
  const len = points.length;

  if (len < 2) {
    return null;
  }

  const yh = getYangHuiTriangleOne(len);

  let x = 0;
  let y = 0;

  points.forEach((point, i) => {
    const yhItem = yh[i] as number;
    x += Math.pow(1 - t, len - i - 1) * point[0] * Math.pow(t, i) * yhItem;
    y += Math.pow(1 - t, len - i - 1) * point[1] * Math.pow(t, i) * yhItem;
  });

  return [strip(x), strip(y)];
}
