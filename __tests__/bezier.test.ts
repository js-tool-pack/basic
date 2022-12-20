import { createArray } from '../src';
import * as Bezier from '../src/bezier';

describe('bezier', function () {
  test('pointBezier2', () => {
    const bezierList = createArray({
      start: 0,
      end: 11,
      fill: (i) => Bezier.pointBezier2(i / 10, [1, 1], [10, 10], [10, 10]),
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
      fill: (i) => Bezier.pointBezier3(i / 10, [1, 1], [2, 2], [8, 8], [10, 10]),
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
