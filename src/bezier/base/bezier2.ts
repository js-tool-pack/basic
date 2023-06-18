import { strip } from '../../number';

/**
 * 2阶贝塞尔曲线
 *
 * @param t 百分比 [0, 1]
 * @param v1 值1
 * @param cv 控制值
 * @param v2 值2
 */
export function bezier2(t: number, v1: number, cv: number, v2: number): number {
  return strip((1 - t) * (1 - t) * v1 + 2 * t * (1 - t) * cv + t * t * v2);
}
