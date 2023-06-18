import { strip } from '../../number';

/**
 * 3阶贝塞尔曲线公式
 *
 * @param t 百分比 [0, 1]
 * @param v1 值1
 * @param cv1 控制值1
 * @param cv2 控制值2
 * @param v2 值2
 */
export function bezier3(t: number, v1: number, cv1: number, cv2: number, v2: number): number {
  return strip(
    v1 * (1 - t) * (1 - t) * (1 - t) +
      3 * cv1 * t * (1 - t) * (1 - t) +
      3 * cv2 * t * t * (1 - t) +
      v2 * t * t * t,
  );
}
