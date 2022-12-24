import { createArray } from '../src';
import { pointBezier3, useCubicBezier3, pointBezier2, pointBezierN } from '../src/bezier';

describe('bezier', function () {
  test('useCubicBezier3', () => {
    const len = 20;

    const c1 = useCubicBezier3(0, 600, 'ease-in-out');
    let list = createArray({
      len: len + 1,
      fill: (i) => c1(i / len),
    });

    expect(list).toEqual([
      0, 4.35, 16.8, 36.45, 62.4, 93.75, 129.6, 169.05, 211.2, 255.15, 300, 344.85, 388.8, 430.95,
      470.4, 506.25, 537.6, 563.55, 583.2, 595.65, 600,
    ]);

    const c2 = useCubicBezier3(0, 600);
    list = createArray({
      len: len + 1,
      fill: (i) => c2(i / len),
    });

    expect(list).toEqual([
      0, 64.2, 122.1, 174.15, 220.8, 262.5, 299.7, 332.85, 362.4, 388.8, 412.5, 433.95, 453.6,
      471.9, 489.3, 506.25, 523.2, 540.6, 558.9, 578.55, 600,
    ]);

    // 反向生成，没有太好的方法检验是否准确
    const c3 = useCubicBezier3(600, 0, 'ease-in-out');
    const list2 = createArray({
      len: len + 1,
      fill: (i) => c3(i / len),
    });

    expect(list2).toEqual([
      600, 595.65, 583.2, 563.55, 537.6, 506.25, 470.4, 430.95, 388.8, 344.85, 300, 255.15, 211.2,
      169.05, 129.6, 93.75, 62.4, 36.45, 16.8, 4.35, 0,
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
