import {
  createArray,
  isArrayLike,
  forEachNum,
  isHEXColor,
  isRGBColor,
  inRange,
  unique,
  omit,
} from '../src';
import * as cm from '../src/random';

describe('random', function () {
  test('randomFloat', () => {
    // 正常参数min max
    expect(inRange(cm.randomFloat(0, 10), [0, 10])).toBe(true);

    // 无参数
    expect(inRange(cm.randomFloat(), [0, 1])).toBe(true);

    // start 作为 end
    expect(inRange(cm.randomFloat(5), [0, 5])).toBe(true);

    // arr
    const randArr: number[] = cm.randomFloat(0, 5, 4) as number[];
    expect(randArr.length).toBe(4);
    for (let i = 0; i < randArr.length; i++) {
      expect(inRange(randArr[i]!, [0, 5])).toBe(true);
    }
    expect(cm.randomFloat(0, 5, 0)).toEqual([]);

    const arr3 = cm.randomFloat(0, 1, 500);
    expect(arr3.length).toBe(500);
    expect(arr3.some((i) => i > 0)).toBeTruthy();
    expect(arr3.some((i) => i < 1)).toBeTruthy();
    expect(arr3.some((i) => i > 0.3 && i < 0.5)).toBeTruthy();
    expect(arr3.some((i) => i >= 0 && i < 0.2)).toBeTruthy();
    expect(arr3.some((i) => i > 0.7 && i < 0.9)).toBeTruthy();
    expect(arr3.some((i) => i >= 1)).toBeFalsy();
    expect(arr3.some((i) => i < 0)).toBeFalsy();

    const arr4 = cm.randomFloat(-10, 10, 200);
    expect(arr4.some((i) => i > -10)).toBeTruthy();
    expect(arr4.some((i) => i < 10)).toBeTruthy();
    expect(arr4.some((i) => i > 5 && i < 6)).toBeTruthy();
    expect(arr4.some((i) => i > -6 && i < -1)).toBeTruthy();
    expect(arr4.some((i) => i > -5 && i < 5)).toBeTruthy();
    expect(arr4.some((i) => i > 10)).toBeFalsy();
    expect(arr4.some((i) => i < -10)).toBeFalsy();

    const arr5 = cm.randomFloat(10, 11, 520);
    expect(arr5.length).toBe(520);
    expect(arr5.some((i) => i < 10)).toBeFalsy();
    expect(arr5.some((i) => i < 10.1)).toBeTruthy();

    const arr6 = cm.randomFloat(0.2, 0.4, 300);
    expect(arr6.length).toBe(300);
    expect(arr6.some((i) => i < 0.2)).toBeFalsy();
    expect(arr6.some((i) => i < 0.4)).toBeTruthy();
    expect(arr6.some((i) => i >= 0.4)).toBeFalsy();
    expect(arr3.some((i) => i > 0.3 && i < 0.4)).toBeTruthy();
  });
  test('randomInt', () => {
    const fn = cm.randomInt;
    const rand = fn(0, 10);
    expect(rand).toBeGreaterThanOrEqual(0);
    expect(rand).toBeLessThan(10);
    //
    const rand2 = fn();
    expect(rand2).toBeGreaterThanOrEqual(0);
    expect(rand2).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    // start as end
    const rand3 = fn(5);
    expect(rand3).toBeGreaterThanOrEqual(0);
    expect(rand3).toBeLessThan(5);
    // arr
    const randArr = fn(0, 5, 4);
    expect(randArr.length).toBe(4);
    for (let i = 0; i < randArr.length; i++) {
      const item = randArr[i];
      expect(item).toBeGreaterThanOrEqual(0);
      expect(item).toBeLessThan(5);
    }
    const randArr2: number[] = fn(0, 5, 0);
    expect(randArr2).toEqual([]);

    const arr3 = fn(0, 1, 500);
    expect(arr3.length).toBe(500);
    expect(arr3.every((i) => i === 0)).toBeTruthy();

    const arr7 = fn(0, 5, 100);
    expect(arr7.length === 100).toBeTruthy();
    expect(arr7.some((i) => i === 0)).toBeTruthy();
    expect(arr7.every((i) => i > -1)).toBeTruthy();
    expect(arr7.every((i) => i < 5)).toBeTruthy();

    const arr4 = fn(-10, 10, 500);
    expect(arr4.some((i) => i === -10)).toBeTruthy();
    expect(arr4.every((i) => i >= -10)).toBeTruthy();
    expect(arr4.every((i) => i < 10)).toBeTruthy();
    expect(arr4.some((i) => i < 10)).toBeTruthy();
    expect(arr4.some((i) => i > 5 && i < 6)).toBeFalsy();
    expect(arr4.some((i) => i > -6 && i < -1)).toBeTruthy();
    expect(arr4.some((i) => i > -5 && i < 5)).toBeTruthy();

    const arr5 = fn(10, 11, 520);
    expect(arr5.length).toBe(520);
    expect(arr5.some((i) => i < 10)).toBeFalsy();
    expect(arr5.every((i) => i < 10.1)).toBeTruthy();
    expect(arr5.every((i) => i === 10)).toBeTruthy();

    const arr6 = fn(0.2, 0.4, 300);
    expect(arr6.length).toBe(300);
    expect(arr6.every((i) => i === 0.2)).toBeTruthy();
    const arr8 = createArray({ fill: () => fn(), len: 200 });
    expect(arr8.length).toBe(200);
    expect(arr8.every((i) => i >= 0 && i < Number.MAX_SAFE_INTEGER)).toBeTruthy();

    const day = 1000 * 60 * 60 * 24;
    forEachNum(100, () => {
      // ~~ 整数太大变负数
      expect(fn(day * 30, day * 100)).toBeGreaterThanOrEqual(0);
    });
  });
  test('randomItem', () => {
    const fn = cm.randomItem;
    const arr = [1, 2];
    forEachNum(100, () => {
      expect(arr.indexOf(fn(arr)) > -1).toBeTruthy();
    });

    const arr2 = createArray({ len: 20 });
    const results = createArray({ fill: () => fn(arr2), len: 1000 });

    expect(results.length).toBe(1000);
    arr2.forEach((it) => {
      expect(results.includes(it)).toBeTruthy();
    });
    expect(results.includes(undefined as any)).toBeFalsy();
  });

  test('randomRGB', () => {
    const fn = cm.randomRGB;
    const rgbList = createArray({ fill: () => fn(), len: 100 });
    rgbList.forEach((it) => {
      expect(isRGBColor(it)).toBeTruthy();
    });
  });
  test('randomRGBA', () => {
    const fn = cm.randomRGBA;
    const rgbList = createArray({ fill: () => fn(), len: 10000 });
    rgbList.forEach((it) => {
      const flag = isRGBColor(it);
      expect(flag).toBeTruthy();
    });
  });

  test('randomColor', () => {
    const fn = cm.randomColor;
    expect(isHEXColor(cm.randomColor())).toBeTruthy();
    // array
    const arr = cm.randomColor(10);
    expect(arr.length === 10).toBeTruthy();
    forEachNum(arr.length, (i) => {
      expect(isHEXColor(arr[i]!)).toBeTruthy();
    });
    expect(isHEXColor(cm.randomColor('HEX'))).toBeTruthy();
    expect(isRGBColor(cm.randomColor('RGB'))).toBeTruthy();
    expect(isRGBColor(cm.randomColor('RGBA'))).toBeTruthy();

    const rgbList = fn('RGB', 20);
    expect(rgbList.length).toBe(20);
    rgbList.forEach((it) => expect(isRGBColor(it)).toBeTruthy());
    const rgbaList = fn('RGBA', 20);
    expect(rgbaList.length).toBe(20);
    rgbaList.forEach((it) => expect(isRGBColor(it)).toBeTruthy());

    expect(isHEXColor(cm.randomColor('' as any))).toBeTruthy();
  });
  test('shuffle', () => {
    const fn = cm.shuffle;

    const arr = createArray({ start: 15, end: 30 });
    const shuffleArr = fn(arr);
    expect(shuffleArr.length).toBe(arr.length);
    arr.forEach((it) => {
      expect(shuffleArr.includes(it)).toBeTruthy();
    });
    expect(arr).not.toEqual(shuffleArr);
    expect(fn([])).toEqual([]);
    expect(() => fn(undefined as any)).toThrowError();

    const arrLike = { length: 6, 2: true, 1: 'a', 3: '3', 4: '4', 5: '5', 0: 1 };
    const newArrLike = fn(arrLike);
    expect(isArrayLike(arrLike)).toBeTruthy();
    expect(arrLike.length).toBe(newArrLike.length);
    expect(arrLike).not.toEqual(newArrLike);

    const values = Object.values(omit(arrLike, ['length']));
    const shuffleValues = Object.values(omit(newArrLike, ['length']));
    expect(unique(shuffleValues).length).toBe(6);

    expect(values.every((it) => shuffleValues.includes(it))).toBeTruthy();

    const arr2 = [{ test: null }, { test: 1 }];
    fn(arr2);
  });
});
