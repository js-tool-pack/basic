import { createArray } from '../src';
import * as Bezier from '../src/bezier';

describe('bezier', function () {
  test('twoBezier', () => {
    const bezierList = createArray({
      start: 0,
      end: 11,
      fill: (i) => Bezier.twoBezier(i / 10, [1, 1], [10, 10], [10, 10]),
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
