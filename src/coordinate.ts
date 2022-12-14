import { CalcChain } from './CalcChain';
import { inRange } from './array';
import { strip } from './number';

/**
 * 坐标点
 */
export type Point = [number, number];

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

/**
 * 根据目标点获取相对于原点的角度
 *
 * 注意：默认旋转方向是向上的 所以(0,0)要顶部向着(1,1)是135度，而不是40度
 * 注意：在屏幕里角度是顺时针的与数学中的逆时针坐标不一样 45度是右下而不是右上方
 *
 * @example
 *
 * getAngle([0, 0], [1, 1]); // 135
 * getAngle([0, 0], [1, 1], 'bottom'); // 315
 * getAngle([0, 0], [1, 1], 'left'); // 225
 * getAngle([0, 0], [1, 1], 'right'); // 45
 *
 * @param origin 原点
 * @param target 目标点
 * @param direct 需要上下左右哪个方向指向目标,默认是'top'
 * @param [direct='top']
 * @returns 角度， 范围:[0,360)
 */
export function getAngle(
  origin: Point,
  target: Point,
  direct: 'top' | 'left' | 'right' | 'bottom' = 'top',
): number {
  const [x1, y1] = origin;
  const [x2, y2] = target;

  // 相对数学坐标系是对的，对于屏幕坐标系不对
  // x = x1 - x2
  // y = y1 - y2
  // r = Math.sqrt(x * x + y * y)
  // angle = Math.round(Math.asin(y / r) / Math.pi * 180)

  // 在两点x轴相同时不对
  // const x = x1 - x2;
  // const y = y1 - y2;
  // const r = Math.sqrt(x * x + y * y);
  // if (r === 0) return 0;
  // return Math.round(Math.acos(x / r) / Math.PI * 180) - 90;

  // https://blog.csdn.net/chelen_jak/article/details/80518973
  const angle = Math.atan2(x2 - x1, y2 - y1); //弧度  0.9272952180016122
  const theta = angle * (180 / Math.PI); //角度  53.13010235415598

  return (
    {
      top: 180 - theta,
      left: 270 - theta,
      bottom: 360 - theta,
      right: 450 - theta,
    }[direct] % 360
  );
}

/**
 * 根据半径与角度获取对应坐标点
 *
 * 采用的是顺时针角度，也就是0度角位置是在原点正上方，180度是在正下方
 *
 * 注意：不要使用[0, 0]作为原点，否则不正确
 *
 * @example
 *
 * const center: Point = [1, 1];
 * const radius = 10;
 *
 * getRotatePoint(center, radius, 0); // [center[0], center[1] - radius]
 * getRotatePoint(center, radius, 90); // [center[0] + radius, center[1]]
 * getRotatePoint(center, radius, 180); // [center[0], center[1] + radius]
 * getRotatePoint(center, radius, 270); // [center[0] - radius, center[1]]
 *
 * @param center 中心点
 * @param radius 半径
 * @param rotate 角度
 */
export function getRotatePoint(center: Point, radius: number, rotate: number): Point {
  const angle = (Math.PI / 180) * rotate;
  // const angle = NumberCalc.init(Math.PI)["/"](180)["*"](rotate).curVal;

  // 圆的参数方程 圆心(a,b) x = a + r * cos; y = b + r * sin;
  // 或正弦定理 a/sinA = b/sinB
  // 因为屏幕上的坐标系与数学上的坐标系不同，所以x，y有所变化
  // let x = center[0] + radius * Math.sin(angle);
  // let y = center[1] - radius * Math.cos(angle);
  const x = CalcChain.init(radius)['*'](Math.sin(angle))['+'](center[0]).value;
  const y = CalcChain.init(radius)['*'](Math.cos(angle)).by(center[1], '-').value;
  return [x, y];
}

/**
 * 根据余弦定理(c^2 = a^2 + b^2 - 2 * a * b * cosA)获取任意边长
 *
 * @example
 *
 * getBorderWidthByCos(3, 4, 90); // 5
 * getBorderWidthByCos(1, 1, 90).toFixed(2); // Math.sqrt(2).toFixed(2)
 *
 * @param a a边
 * @param b b边
 * @param angle 要获取的边长对应的角度
 */
export function getBorderWidthByCos(a: number, b: number, angle: number) {
  // 角度化弧度
  const C = (angle * Math.PI) / 180;
  const c2 = a ** 2 + b ** 2 - 2 * a * b * Math.cos(C);
  return Math.sqrt(c2);
}

/**
 * 根据正弦定理(a/sinA = b/sinB = c/sinC)获取对应边长
 *
 * @example
 *
 * getBorderWidthBySin(1, 45, 90).toFixed(2); // Math.sqrt(2).toFixed(2)
 * getBorderWidthBySin(1, 45, 45); // 1
 *
 * @param a a边
 * @param angleA 角A
 * @param angleB 要获取的边长对应的角度
 */
export function getBorderWidthBySin(a: number, angleA: number, angleB: number) {
  // 角度化弧度
  const rad = Math.PI / 180;
  const radA = rad * angleA;
  const radB = rad * angleB;
  const resA = a / Math.sin(radA);
  return resA * Math.sin(radB);
}

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
