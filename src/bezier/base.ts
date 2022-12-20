/**
 * 2阶贝塞尔曲线
 *
 * @param t 百分比 [0, 1]
 * @param v1 值1
 * @param cv 控制值
 * @param v2 值2
 */
export function bezier2(t: number, v1: number, cv: number, v2: number): number {
  return (1 - t) * (1 - t) * v1 + 2 * t * (1 - t) * cv + t * t * v2;
}

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
  return (
    v1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cv1 * t * (1 - t) * (1 - t) +
    3 * cv2 * t * t * (1 - t) +
    v2 * t * t * t
  );
}
