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
  test('pointBezier3', () => {
    const bezierList = createArray({
      start: 0,
      end: 11,
      fill: (i) => pointBezier3(i / 10, [1, 1], [2, 2], [8, 8], [10, 10]),
    });

    // [
    //   [1, 1],
    //   [1.4410000000000003, 1.4410000000000003],
    //   [2.1280000000000006, 2.1280000000000006],
    //   [3.0069999999999992, 3.0069999999999992],
    //   [4.024000000000001, 4.024000000000001],
    //   [5.125, 5.125],
    //   [6.2559999999999985, 6.2559999999999985],
    //   [7.3629999999999995, 7.3629999999999995],
    //   [8.392000000000001, 8.392000000000001],
    //   [9.289, 9.289],
    //   [10, 10],
    // ];

    expect(bezierList).toEqual([
      [1, 1],
      [1.4410000000000003, 1.4410000000000003],
      [2.1280000000000006, 2.1280000000000006],
      [3.0069999999999992, 3.0069999999999992],
      [4.024000000000001, 4.024000000000001],
      [5.125, 5.125],
      [6.2559999999999985, 6.2559999999999985],
      [7.3629999999999995, 7.3629999999999995],
      [8.392000000000001, 8.392000000000001],
      [9.289, 9.289],
      [10, 10],
    ]);
  });
});
