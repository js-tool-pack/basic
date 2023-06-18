import * as cd from '../src/coordinate';
import type { Point } from '@tool-pack/types';

describe('coordinate', function () {
  test('isPointInPath', () => {
    expect(
      cd.isPointInPath(
        [1, 2],
        [
          [0, 0],
          [2, 4],
        ],
      ),
    ).toBe(true);
    expect(
      cd.isPointInPath(
        [2, 2],
        [
          [0, 0],
          [2, 4],
        ],
      ),
    ).toBe(false);

    expect(
      cd.isPointInPath(
        [2, 2],
        [
          [0, 0],
          [4, 4],
        ],
      ),
    ).toBe(true);
    expect(
      cd.isPointInPath(
        [1, 2],
        [
          [0, 0],
          [4, 4],
        ],
      ),
    ).toBe(false);
    expect(
      cd.isPointInPath(
        [1, 2],
        [
          [0, 0],
          [2, 4],
          [4, 4],
        ],
      ),
    ).toBe(true);

    expect(
      cd.isPointInPath(
        [3, 3],
        [
          [1, 1],
          [4, 4],
        ],
      ),
    ).toBe(true);
  });
  test('getDistance', () => {
    expect(cd.getDistance([0, 0], [3, 4])).toBe(5);
    expect(cd.getDistance([0, 0], [1, 1])).toBe(Math.sqrt(2));
    expect(Math.round(cd.getDistance([0, 0], [1, Math.sqrt(3)]))).toBe(2);
    expect(cd.getDistance([0, 0], [0, 5])).toBe(5);
    expect(cd.getDistance([0, 0], [5, 0])).toBe(5);
    expect(cd.getDistance([0, 0], [-5, 0])).toBe(5);
    expect(cd.getDistance([0, 0], [0, -5])).toBe(5);
  });
  test('getAngle', () => {
    const origin: Point = [0, 0];

    // 正4点
    //                [0,-1]
    //                  │
    //                  │
    //                  │[0,0]
    // [-1,0] ——————————│—————————— [1,0]
    //                  │
    //                  │
    //                  │
    //                [0,1]
    const top: Point = [0, -1];
    const bottom: Point = [0, 1];
    const left: Point = [-1, 0];
    const right: Point = [1, 0];

    // top
    expect(cd.getAngle(origin, [1, 1])).toBe(135);
    expect(cd.getAngle(origin, top)).toBe(0);
    expect(cd.getAngle(origin, bottom)).toBe(180);
    expect(cd.getAngle(origin, right)).toBe(90);
    expect(cd.getAngle(origin, left)).toBe(270);

    // bottom
    expect(cd.getAngle(origin, [1, 1], 'bottom')).toBe(315);
    expect(cd.getAngle(origin, top, 'bottom')).toBe(180);
    expect(cd.getAngle(origin, bottom, 'bottom')).toBe(0);
    expect(cd.getAngle(origin, left, 'bottom')).toBe(90);
    expect(cd.getAngle(origin, right, 'bottom')).toBe(270);

    // right
    expect(cd.getAngle(origin, [1, 1], 'right')).toBe(45);
    expect(cd.getAngle(origin, top, 'right')).toBe(270);
    expect(cd.getAngle(origin, bottom, 'right')).toBe(90);
    expect(cd.getAngle(origin, left, 'right')).toBe(180);
    expect(cd.getAngle(origin, right, 'right')).toBe(0);

    // left
    expect(cd.getAngle(origin, [1, 1], 'left')).toBe(225);
    expect(cd.getAngle(origin, top, 'left')).toBe(90);
    expect(cd.getAngle(origin, bottom, 'left')).toBe(270);
    expect(cd.getAngle(origin, left, 'left')).toBe(0);
    expect(cd.getAngle(origin, right, 'left')).toBe(180);
  });
  test('getRotatePoint', () => {
    expect(cd.getRotatePoint([0, 0], Math.sqrt(2), 135)).toEqual([1, 1]);

    const center: Point = [1, 1];
    const radius = 10;
    expect(cd.getRotatePoint(center, radius, 0)).toEqual([center[0], center[1] - radius]);
    expect(cd.getRotatePoint(center, radius, 90)).toEqual([center[0] + radius, center[1]]);
    expect(cd.getRotatePoint(center, radius, 180)).toEqual([center[0], center[1] + radius]);
    expect(cd.getRotatePoint(center, radius, 270)).toEqual([center[0] - radius, center[1]]);
  });
  test('getBorderWidthByCos', () => {
    expect(cd.getBorderWidthByCos(3, 4, 90)).toEqual(5);
    expect(cd.getBorderWidthByCos(1, 1, 90).toFixed(2)).toEqual(Math.sqrt(2).toFixed(2));
  });
  test('getBorderWidthBySin', () => {
    expect(cd.getBorderWidthBySin(1, 45, 90).toFixed(2)).toEqual(Math.sqrt(2).toFixed(2));
    expect(cd.getBorderWidthBySin(1, 45, 45)).toEqual(1);
  });
  test('rectCoordToScreen', () => {
    const rectCoordToScreen = cd.rectCoordToScreen;

    // 直接转换
    expect(rectCoordToScreen([0, 3], [3, 3])).toEqual([0, 0]);
    expect(rectCoordToScreen([0, 0], [3, 3])).toEqual([0, 3]);
    expect(rectCoordToScreen([1, 1], [3, 3])).toEqual([1, 2]);
    expect(rectCoordToScreen([5, 5], [20, 20])).toEqual([5, 15]);

    // 按比例转换，并翻转图像
    expect(rectCoordToScreen([0, 0], [2, 2], [3, 3])).toEqual([0, 0]);
    expect(rectCoordToScreen([1, 1], [3, 3], [3, 3])).toEqual([1, 1]);
    expect(rectCoordToScreen([5, 5], [20, 20], [30, 30])).toEqual([7.5, 7.5]);

    // 按比例转换，保持原图像
    expect(rectCoordToScreen([0, 3], [3, 3], [3, 3], true)).toEqual([0, 0]);
    expect(rectCoordToScreen([1, 1], [3, 3], [3, 3], true)).toEqual([1, 2]);
    expect(rectCoordToScreen([5, 5], [20, 20], [30, 30], true)).toEqual([7.5, 22.5]);
  });
});
