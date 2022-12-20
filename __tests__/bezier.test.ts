import { bezier3withTimingFN, createArray, Point } from '../src';
import { pointBezier3, pointBezier2 } from '../src/bezier';

describe('bezier', function () {
  test('bezier3withTimingFN', () => {
    const timingFn = {
      ease: '.25,.1,.25,1',
      linear: '0,0,1,1',
      'ease-in': '.42,0,1,1',
      'ease-out': '0,0,.58,1',
      'ease-in-out': '.42,0,.58,1',
    };
    function bezierTiming(t: number, p1: Point, p2: Point, tm = 'ease') {
      const fn = timingFn[tm].split(',').map(Number);
      const xv = Math.abs(p2[0] - p1[0]);
      const yv = Math.abs(p2[1] - p1[1]);
      return pointBezier3(t, p1, [xv * fn[0], yv - yv * fn[1]], [xv * fn[2], yv - yv * fn[3]], p2);
    }

    const len = 20;
    const paths = createArray({
      len: len + 1,
      fill: (i) => bezierTiming(i / len, [0, 600], [600, 0], 'ease-in-out'),
    }).map(([x]) => x);

    const list = createArray({
      len: len + 1,
      fill: (i) => bezier3withTimingFN(i / len, 0, 600, 'ease-in-out'),
    });

    expect(list).toEqual(paths);

    const list2 = createArray({
      len: len + 1,
      fill: (i) => bezier3withTimingFN(i / len, 600, 0, 'ease-in-out'),
    });

    expect(list2).toEqual(paths);
  });
  test('pointBezier2', () => {
    const bezierList = createArray({
      start: 0,
      end: 11,
      fill: (i) => pointBezier2(i / 10, [1, 1], [10, 10], [10, 10]),
    });

    expect(bezierList).toEqual([
      [1, 1],
      [2.71, 2.71],
      [4.24, 4.24],
      [5.59, 5.59],
      [6.76, 6.76],
      [7.75, 7.75],
      [8.56, 8.56],
      [9.19, 9.19],
      [9.64, 9.64],
      [9.91, 9.91],
      [10, 10],
    ]);
  });
  test('pointBezier3', () => {
    const bezierList = createArray({
      start: 0,
      end: 11,
      fill: (i) => pointBezier3(i / 10, [1, 1], [2, 2], [8, 8], [10, 10]),
    });

    expect(bezierList).toEqual([
      [1, 1],
      [1.441, 1.441],
      [2.128, 2.128],
      [3.007, 3.007],
      [4.024, 4.024],
      [5.125, 5.125],
      [6.256, 6.256],
      [7.363, 7.363],
      [8.392, 8.392],
      [9.289, 9.289],
      [10, 10],
    ]);
  });
});
