import type { Point } from '@tool-pack/types';
import { CalcChain } from '../CalcChain';

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
