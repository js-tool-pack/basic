import type { Point } from './Point';

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
