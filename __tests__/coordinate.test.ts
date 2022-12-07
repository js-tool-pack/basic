import * as cd from '../src/coordinate';
import { createArray } from '../src';

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
    expect(cd.getAngle([0, 0], [1, 1])).toBe(135);
    expect(cd.getAngle([0, 0], [1, 1], cd.Direct.bottom)).toBe(315);
    expect(cd.getAngle([0, 0], [1, 1], cd.Direct.left)).toBe(225);
    expect(cd.getAngle([0, 0], [1, 1], cd.Direct.right)).toBe(45);
  });
  test('getRotatePoint', () => {
    expect(cd.getRotatePoint([0, 0], Math.sqrt(2), 135)).toEqual([1, 1]);

    const center: cd.Point = [1, 1];
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
  test('twoBezier', () => {
    const bezierList = createArray({
      start: 0,
      end: 11,
      fill: (i) => cd.twoBezier(i / 10, [1, 1], [10, 10], [10, 10]),
    });

    // [
    //   [1, 1],
    //   [2.7100000000000004, 2.7100000000000004],
    //   [4.240000000000001, 4.240000000000001],
    //   [5.59, 5.59],
    //   [6.760000000000001, 6.760000000000001],
    //   [7.75, 7.75],
    //   [8.559999999999999, 8.559999999999999],
    //   [9.19, 9.19],
    //   [9.64, 9.64],
    //   [9.91, 9.91],
    //   [10, 10],
    // ]

    expect(bezierList).toEqual([
      [1, 1],
      [2.7100000000000004, 2.7100000000000004],
      [4.240000000000001, 4.240000000000001],
      [5.59, 5.59],
      [6.760000000000001, 6.760000000000001],
      [7.75, 7.75],
      [8.559999999999999, 8.559999999999999],
      [9.19, 9.19],
      [9.64, 9.64],
      [9.91, 9.91],
      [10, 10],
    ]);
  });
});