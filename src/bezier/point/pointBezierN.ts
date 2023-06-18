import type { Point } from '@tool-pack/types';
import { getYangHuiTriangleOne } from '../../array';
import { strip } from '../../number';

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
