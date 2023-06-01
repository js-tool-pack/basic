import { strip } from '../number';
import type { Tuple } from '@tool-pack/types';

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
 * 使用3阶贝塞尔曲线缓动函数
 * ---
 * 相当于使用 css 的 transition-timing-function: cubic-bezier()
 *
 * 预设有ease ease-in ease-out ease-in-out linear等5个常用的缓动函数
 */
export function useCubicBezier3(
  v1: number,
  v2: number,
  tm: keyof typeof predefined | Tuple<number, 4> = 'ease',
): (t: number) => number {
  const fn =
    typeof tm === 'string' ? (predefined[tm].split(',').map(Number) as Tuple<number, 4>) : tm;

  const [a, b, c, d] = fn;

  // 原文：https://zhuanlan.zhihu.com/p/60193908
  // https://codepen.io/delbertbeta/pen/VRxxgM/
  // 可参考：https://github.com/pofulu/sparkar-bezier-easing/blob/master/BezierEasing.ts

  const px3 = 3 * a;
  const px2 = 3 * (c - a) - px3;
  const px1 = 1 - px3 - px2;
  const py3 = 3 * b;
  const py2 = 3 * (d - b) - py3;
  const py1 = 1 - py3 - py2;
  const epsilon = 1e-7; // 目标精度

  const getX = (t: number) => ((px1 * t + px2) * t + px3) * t;

  const getY = (t: number) => ((py1 * t + py2) * t + py3) * t;

  const solve = function (x: number): number {
    if (x === 0 || x === 1) {
      // 对 0 和 1 两个特殊 t 不做计算
      return getY(x);
    }
    let t = x;
    for (let i = 0; i < 8; i++) {
      // 进行 8 次迭代
      const g = getX(t) - x;
      if (Math.abs(g) < epsilon) {
        // 检测误差到可以接受的范围
        return getY(t);
      }
      const d = (3 * px1 * t + 2 * px2) * t + px3; // 对 x 求导
      if (Math.abs(d) < 1e-6) {
        // 如果梯度过低，说明牛顿迭代法无法达到更高精度
        break;
      }
      t = t - g / d;
    }
    return getY(t); // 对得到的近似 t 求 y
  };

  const distance = Math.abs(v2 - v1);

  return v1 > v2
    ? (t: number): number => strip(distance - solve(t) * distance)
    : (t: number): number => strip(solve(t) * distance);
}
