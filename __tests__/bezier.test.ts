import { createArray, Point } from '../src';
import { pointBezier3, useCubicBezier3, pointBezier2, pointBezierN } from '../src/bezier';

describe('bezier', function () {
  test('useCubicBezier3', () => {
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
    let paths = createArray({
      len: len + 1,
      fill: (i) => bezierTiming(i / len, [0, 600], [600, 0], 'ease-in-out'),
    }).map(([x]) => x);

    const c1 = useCubicBezier3(0, 600, 'ease-in-out');
    let list = createArray({
      len: len + 1,
      fill: (i) => c1(i / len),
    });

    expect(list).toEqual(paths);

    paths = createArray({
      len: len + 1,
      fill: (i) => bezierTiming(i / len, [0, 600], [600, 0]),
    }).map(([x]) => x);

    const c2 = useCubicBezier3(0, 600);
    list = createArray({
      len: len + 1,
      fill: (i) => c2(i / len),
    });

    expect(list).toEqual(paths);

    // 反向生成，没有太好的方法检验是否准确
    const c3 = useCubicBezier3(600, 0, 'ease-in-out');
    const list2 = createArray({
      len: len + 1,
      fill: (i) => c3(i / len),
    });

    expect(list2).toEqual([
      600, 563.331, 528.768, 496.077, 465.024, 435.375, 406.896, 379.353, 352.512, 326.139, 300,
      273.861, 247.488, 220.647, 193.104, 164.625, 134.976, 103.923, 71.232, 36.669, 0,
    ]);
  });
  const b2Res = [
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
  ];
  test('pointBezier2', () => {
    const bezierList = createArray({
      start: 0,
      end: 11,
      fill: (i) => pointBezier2(i / 10, [1, 1], [10, 10], [10, 10]),
    });

    expect(bezierList).toEqual(b2Res);
  });
  const b3Res = [
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
  ];
  test('pointBezier3', () => {
    const bezierList = createArray({
      start: 0,
      end: 11,
      fill: (i) => pointBezier3(i / 10, [1, 1], [2, 2], [8, 8], [10, 10]),
    });

    expect(bezierList).toEqual(b3Res);
  });
  test('pointBezierN', () => {
    // 2阶
    const bezierList2 = createArray({
      start: 0,
      end: 11,
      fill: (i) => pointBezierN(i / 10, [1, 1], [10, 10], [10, 10]),
    });

    expect(bezierList2).toEqual(b2Res);

    // 3阶
    const bezierList3 = createArray({
      start: 0,
      end: 11,
      fill: (i) => pointBezierN(i / 10, [1, 1], [2, 2], [8, 8], [10, 10]),
    });

    expect(bezierList3).toEqual(b3Res);

    // 4阶
    const bezierList5 = createArray({
      start: 0,
      end: 11,
      fill: (i) => pointBezierN(i / 10, [1, 1], [2, 2], [5, 5], [8, 8], [10, 10]),
    });

    expect(bezierList5).toEqual([
      [1, 1],
      [1.5121, 1.5121],
      [2.2176, 2.2176],
      [3.0721, 3.0721],
      [4.0336, 4.0336],
      [5.0625, 5.0625],
      [6.1216, 6.1216],
      [7.1761, 7.1761],
      [8.1936, 8.1936],
      [9.1441, 9.1441],
      [10, 10],
    ]);

    expect(pointBezierN(0)).toBe(null);
  });
});
