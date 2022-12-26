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
      0, 2.8978495756, 11.8334683583, 27.1261714038, 48.9958932295, 77.4971403413, 112.437534695,
      153.291365703, 199.130321832, 248.603825388, 300, 351.396174612, 400.869678168, 446.708634297,
      487.562465305, 522.502859659, 551.004106771, 572.873828596, 588.166531642, 597.102150424, 600,
    ]);

    const c2 = useCubicBezier3(0, 600);
    list = createArray({
      len: len + 1,
      fill: (i) => c2(i / len),
    });

    expect(list).toEqual([
      0, 19.7708804948, 56.8777834291, 111.273922296, 177.14673403, 245.106355809, 307.989213032,
      362.876806317, 409.524303609, 448.712062362, 481.442032617, 508.651133406, 531.137585936,
      549.560309273, 564.458768579, 576.275387009, 585.375221313, 592.061838803, 596.589886506,
      599.17472487, 600,
    ]);

    // 反向生成，没有太好的方法检验是否准确
    const c3 = useCubicBezier3(600, 0, 'ease-in-out');
    const list2 = createArray({
      len: len + 1,
      fill: (i) => c3(i / len),
    });

    expect(list2).toEqual([
      600, 597.102150424, 588.166531642, 572.873828596, 551.004106771, 522.502859659, 487.562465305,
      446.708634297, 400.869678168, 351.396174612, 300, 248.603825388, 199.130321832, 153.291365703,
      112.437534695, 77.4971403413, 48.9958932295, 27.1261714038, 11.8334683583, 2.8978495756, 0,
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
