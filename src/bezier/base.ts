import { Tuple } from '@tool-pack/types';
import { strip } from '../number';

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

const predefined = {
  ease: '.25,.1,.25,1',
  linear: '0,0,1,1',
  'ease-in': '.42,0,1,1',
  'ease-out': '0,0,.58,1',
  'ease-in-out': '.42,0,.58,1',
};

/**
 * 使用3阶贝塞尔曲线
 * ---
 * 从低到高到顺序生成的曲线正确性是可以保证的，否则可能不对
 *
 */
export function useCubicBezier3(
  v1: number,
  v2: number,
  tm: keyof typeof predefined | Tuple<number, 4> = 'ease',
): (t: number) => number {
  const fn =
    typeof tm === 'string' ? (predefined[tm].split(',').map(Number) as Tuple<number, 4>) : tm;

  const isReverse = v1 > v2;
  const max = v1;

  if (isReverse) {
    v1 = max - v1;
    v2 = max - v2;
  }

  const abs = Math.abs(v2 - v1);
  const cv1 = abs * fn[0];
  const cv2 = abs * fn[2];

  return function (t: number) {
    const bz = bezier3(t, v1, cv1, cv2, v2);
    return isReverse ? strip(max - bz) : bz;
  };
}
