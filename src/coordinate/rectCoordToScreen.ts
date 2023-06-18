import type { Point } from './Point';
import { strip } from '../number';

/**
 * 笛卡尔坐标系(平面直角坐标系)转屏幕坐标系
 * ---
 * 翻转y轴，保持原图像
 *
 * @example
 *
 * // 直接转换
 *
 * // 3 │*
 * // 2 │
 * // 1 │
 * //   -------------
 * // 0    1   2   3
 *
 * // [0, 3] 转换为 [0, 0]
 *
 * // 0    1   2   3
 * //   -*-----------
 * // 1 │
 * // 2 │
 * // 3 │
 *
 * rectCoordToScreen([0, 3], [3, 3]); // [0, 0]
 *
 * // 3 │
 * // 2 │
 * // 1 │
 * //   -*------------
 * // 0    1   2   3
 *
 * // [0, 0] 转换为 [0, 3]
 *
 * // 0    1   2   3
 * //   -------------
 * // 1 │
 * // 2 │
 * // 3 │*
 *
 * rectCoordToScreen([0, 0], [3, 3]); // [0, 3]
 *
 * // 3 │
 * // 2 │
 * // 1 │  *
 * //   --------------
 * // 0    1   2   3
 *
 * // [1, 1] 转换为 [1, 2]
 *
 * // 0    1   2   3
 * //   -------------
 * // 1 │
 * // 2 │  *
 * // 3 │
 *
 * rectCoordToScreen([1, 1], [3, 3]); // [1, 2]
 *
 * rectCoordToScreen([5, 5], [20, 20]); // [5, 15]
 *
 * @param curPos 当前坐标点
 * @param curView 当前坐标容器宽高
 *
 */
export function rectCoordToScreen(curPos: Point, curView: Point): Point;
/**
 * 笛卡尔坐标系(平面直角坐标系)转屏幕坐标系
 * ---
 * 按比例转换，图像会翻转
 *
 * @example
 *
 * // 按比例转换，并翻转图像
 *
 *
 * // 2 │
 * // 1 │
 * //   -*--------
 * // 0    1   2
 *
 * // [0, 0] 转换为 [0, 0]
 *
 * // 0    1   2   3
 * //   -*------------
 * // 1 │
 * // 2 │
 * // 3 │
 * rectCoordToScreen([0, 0], [2, 2], [3, 3]); // [0, 0]
 *
 * // 3 │
 * // 2 │
 * // 1 │  *
 * //   -------------
 * // 0    1   2   3
 *
 * // [0, 3] 转换为 [0, 0]
 *
 * // 0    1   2   3
 * //   -------------
 * // 1 │  *
 * // 2 │
 * // 3 │
 *
 * rectCoordToScreen([1, 1], [3, 3], [3, 3]); // [1, 1]
 *
 * rectCoordToScreen([5, 5], [20, 20], [30, 30]); // [7.5, 7.5]
 *
 * @param curPos 当前坐标点
 * @param curView 当前坐标容器宽高
 * @param targetView 目标坐标容器宽高
 * @param keep 是否保持原图像
 */
export function rectCoordToScreen(
  curPos: Point,
  curView: Point,
  targetView: Point,
  keep?: false,
): Point;
/**
 * 笛卡尔坐标系(平面直角坐标系)转屏幕坐标系
 * ---
 * 按比例转换，保持原图像 综合以上两种效果：按比例+保持原图像 翻转
 *
 * @example
 *
 * // 3 │*
 * // 2 │
 * // 1 │
 * //   -------------
 * // 0    1   2   3
 *
 * // [0, 3] 转换为 [0, 0]
 *
 * // 0    1   2   3
 * //   -*-----------
 * // 1 │
 * // 2 │
 * // 3 │
 * rectCoordToScreen([0, 3], [3, 3], [3, 3], true); // [0, 0]
 *
 * // 3 │
 * // 2 │
 * // 1 │  *
 * //   --------------
 * // 0    1   2   3
 *
 * // [1, 1] 转换为 [1, 2]
 *
 * // 0    1   2   3
 * //   -------------
 * // 1 │
 * // 2 │  *
 * // 3 │
 *
 * rectCoordToScreen([1, 1], [3, 3], [3, 3], true); // [1, 2]
 *
 *
 * rectCoordToScreen([5, 5], [20, 20], [30, 30], true); // [7.5, 22.5]
 *
 * @param curPos 当前坐标点
 * @param curView 当前坐标容器宽高
 * @param targetView 目标坐标容器宽高
 * @param keep 保持为原图像
 */
export function rectCoordToScreen(
  curPos: Point,
  curView: Point,
  targetView: Point,
  keep: true,
): Point;
export function rectCoordToScreen(
  curPos: Point,
  curView: Point,
  targetView?: Point,
  keep = false,
): Point {
  const [x, y] = curPos;
  const [w, h] = curView;
  if (!targetView) return [x, h - y];
  const [tw, ty] = targetView;
  const x1 = (x / w) * tw;
  const y1 = ((keep ? h - y : y) / h) * ty;
  return [strip(x1), strip(y1)];
}
