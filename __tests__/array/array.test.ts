import {
  createArray,
  forEach,
  forEachObj,
  isEqual,
  forEachRight,
  findIndex,
  findIndexRight,
  binaryFind,
  binaryFindIndex,
  insertToArray,
  arrayRemoveItem,
  arrayRemoveItemsBy,
  unique,
  chunk,
  inRange,
  inRanges,
  groupBy,
  someInList,
  castArray,
} from '../../src';

describe('array', function () {
  test('createArray', () => {
    expect(createArray({ start: 0, end: 2 })).toEqual([0, 1]);
    expect(createArray({ start: 0, len: 2 })).toEqual([0, 1]);
    expect(createArray({ len: 2 })).toEqual([0, 1]);
    expect(createArray({ len: 5, end: 3 })).toEqual([0, 1, 2]);
    expect(createArray({ start: 3, end: 2 })).toEqual([]);
    expect(createArray({ start: 3, len: 2 })).toEqual([3, 4]);
    expect(createArray({ start: 3, len: 5, end: 5 })).toEqual([3, 4]);
    expect(createArray({ start: 3, len: 1, end: 5 })).toEqual([3]);
    expect(
      createArray({
        start: 3,
        len: 5,
        end: 5,
        fill(item, index) {
          return item + '' + index;
        },
      }),
    ).toEqual(['30', '41']);
    expect(createArray({ start: 3, len: 5, end: 6, fill: 0 })).toEqual([0, 0, 0]);
  });
  test('forEach', () => {
    const arr1 = [1, 2, 3];
    let isDone = forEach(arr1, (_v, k) => (arr1[k] = k));
    expect(isEqual(arr1, [0, 1, 2])).toBe(true);
    expect(isDone).toBe(true);

    // ArrayLike
    isDone = forEach({ 0: 1, 1: 2, length: 2 }, (_v, k) => (arr1[k] = k + k));
    expect(isEqual(arr1, [0, 2, 2])).toBe(true);
    expect(isDone).toBe(true);

    isDone = forEach(arr1, (_v, k) => {
      arr1[k] = k + 1;
      return k !== 1;
    });
    expect(isDone).toBe(false);
    expect(isEqual(arr1, [1, 2, 2])).toBe(true);

    const arr2: (number | string)[] = [2, 3, 4];
    isDone = forEach(arr2, (v, k) => (arr2[k] = 'a' + v));
    expect(isDone).toBe(true);
    expect(arr2).toEqual(['a2', 'a3', 'a4']);
    isDone = forEach(arr2, (_v, k) => (arr2[k] = 'a' + k));
    expect(arr2).toEqual(['a0', 'a1', 'a2']);
    expect(isDone).toBe(true);

    let elseCount = 0;
    isDone = forEach(
      arr2,
      (v, k) => (arr2[k] = 'a' + v),
      () => elseCount++, // 完整遍历以后会执行该方法
    );
    expect(isDone).toBe(true);
    expect(elseCount).toBe(1);

    isDone = forEach(
      arr2,
      () => false,
      () => elseCount++,
    );
    expect(isDone).toBe(false);
    expect(elseCount).toBe(1);

    let count = 0;
    isDone = forEach({} as any, () => count++);
    expect(isDone).toBe(true);
    expect(count).toEqual(0);
  });
  test('forEachRight', () => {
    const arr: number[] = [];
    forEachRight([1, 2, 3, 4], (i) => arr.push(i + 1));
    expect(arr).toEqual([5, 4, 3, 2]);

    const result: any = {};
    forEachRight(createArray({ len: 20 }), (v, k) => {
      result[k] = v;
      if (k === 10) return false;
      return;
    });
    expect(result).toEqual(
      createArray({ start: 10, end: 20 }).reduce((obj, v) => {
        obj[v] = v;
        return obj;
      }, {} as Record<string, any>),
    );

    const result2: any[] = [];
    forEachRight(createArray({ len: 20 }), (v, k) => {
      result2.push({ [k]: v });
      if (k === 15) return false;
      return;
    });

    expect(result2).toEqual([{ 19: 19 }, { 18: 18 }, { 17: 17 }, { 16: 16 }, { 15: 15 }]);

    let elseCount = 0;
    const isDone = forEach(
      arr,
      () => {},
      () => elseCount++, // 完整遍历以后会执行该方法
    );
    expect(isDone).toBe(true);
    expect(elseCount).toBe(1);
  });
  test('castArray', () => {
    const fn = castArray;
    expect(fn(0)).toEqual([0]);
    expect(fn('')).toEqual(['']);
    expect(fn([1, 2, 3])).toEqual([1, 2, 3]);
  });
  test('findIndex', () => {
    // 中途删除
    const i = [1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1].findIndex((v, index, a) => {
      if (v === 1) a.splice(index, 1);
      return v === 4;
    });
    expect(i).toBe(3);

    const i2 = findIndex([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1], (v, index, a) => {
      if (v === 1) (a as number[]).splice(index, 1);
      return v === 4;
    });
    expect(i2).toBe(3);

    expect(findIndex([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1], (v) => v === 4)).toBe(5);
    expect(findIndex([{ v: 1 }, { v: 2 }], (v) => v.v === 4)).toBe(-1);
    expect(findIndex([{ v: 1 }, { v: 2 }], (v) => v.v === 2)).toBe(1);

    expect(findIndex([], undefined as any)).toBe(-1);
  });
  test('findIndexRight', () => {
    const list = [1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1];
    const result: number[] = [];
    const i = findIndexRight(list, (v) => (result.push(v), v === 4));
    expect(i).toEqual(5);
    expect(result).toEqual([1, 1, 1, 1, 1, 4]);
    expect(findIndexRight([{ v: 1 }, { v: 2 }], (v) => v.v === 4)).toEqual(-1);
    expect(findIndexRight([{ v: 1 }, { v: 2 }, { v: 3 }], (v) => v.v === 2)).toEqual(1);

    expect(findIndexRight([], undefined as any)).toBe(-1);
  });
  test('binaryFindIndex', () => {
    // console.log('-----binaryFindIndex------');

    const list: { id: number }[] = Array.from({ length: 100 }).map((_, i) => ({ id: i * 2 }));

    function find(target: number): {
      times: number;
      index: ReturnType<typeof binaryFindIndex>;
    } {
      // 查找次数
      let times = 0;
      const index = binaryFindIndex(list, function ({ item, index, start, end }) {
        times++;
        // console.log(index);
        // 判断index是否正确
        expect(list[index]).toBe(item);
        // 0 <= (start) < end <= list.length
        expect(start).toBeGreaterThanOrEqual(0);
        expect(start).toBeLessThan(end);
        expect(start).toBeLessThan(list.length);
        expect(end).toBeLessThanOrEqual(list.length);

        return target - item.id;
      });
      return { times, index };
    }

    let res = find(58);
    expect(res.times).toBe(5);
    expect(res.index).toBe(29);

    // console.log('--------min-------');
    // 判断边缘 min
    const minIndex = 0;
    const first = list[minIndex]!;
    res = find(first.id);
    expect(res.times).toBe(7);
    expect(res.index).toBe(minIndex);

    // console.log('----max-----');
    // 判断边缘 max
    const maxIndex = list.length - 1;
    const last = list[maxIndex]!;
    res = find(last.id);
    expect(res.times).toBe(6);
    expect(res.index).toBe(maxIndex);

    // 正常查找
    let findTimes = 0;
    const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
    expect(binaryFindIndex(arr, (o) => (findTimes++, 3 - o.item.id))).toBe(2);
    expect(findTimes).toBe(3);

    findTimes = 0;
    expect(binaryFindIndex(arr, (o) => (findTimes++, 2 - o.item.id))).toBe(1);
    expect(findTimes).toBe(2);

    findTimes = 0;
    expect(binaryFindIndex(arr, (o) => (findTimes++, 6 - o.item.id))).toBe(5);
    expect(findTimes).toBe(2);

    findTimes = 0;
    expect(binaryFindIndex(arr, (o) => (findTimes++, 7 - o.item.id))).toBe(-1);
    expect(findTimes).toBe(2);

    // cover
    expect(
      binaryFindIndex([1], ({ item }) => {
        // console.log(index, start, end);
        return 0 - item;
      }),
    ).toBe(-1);
    expect(binaryFindIndex([], ({ item }) => item)).toBe(-1);
    expect(binaryFindIndex(list, ({ item }) => 55 - item.id)).toBe(-1);
  });
  test('binaryFind', () => {
    const list: { id: number }[] = [...Array(100).keys()].map((i) => ({ id: i * 2 }));

    function find(target: number): { times: number; value: ReturnType<typeof binaryFind> } {
      let times = 0;
      const value = binaryFind(list, ({ item, index }) => {
        times++;
        // console.log(index);
        // 判断index是否正确
        expect(list[index]).toBe(item);
        return target - item.id;
      });
      return { times, value };
    }

    let res = find(58);
    expect(res.times).toBe(5);
    expect(res.value).toEqual({ id: 58 });

    // console.log('----min-----');
    // 判断边缘 min
    const first = list[0]!;
    res = find(first.id);
    expect(res.times).toBe(7);
    expect(res.value).toEqual(first);

    // console.log('----max-----');
    // 判断边缘 max
    const maxIndex = list.length - 1;
    const last = list[maxIndex]!;
    res = find(last.id);
    expect(res.times).toBe(6);
    expect(res.value).toEqual(last);

    // 正常查找
    let findTimes = 0;
    const arr = [
      { id: 1, text: '1' },
      { id: 2, text: '2' },
      { id: 3, text: '3' },
      { id: 4, text: '4' },
      { id: 5, text: '5' },
      { id: 6, text: '6' },
    ];

    expect(binaryFind(arr, (o) => (findTimes++, 3 - o.item.id))).toEqual({ id: 3, text: '3' });
    expect(findTimes).toBe(3);

    findTimes = 0;
    expect(binaryFind(arr, (o) => (findTimes++, 2 - o.item.id))).toEqual({ id: 2, text: '2' });
    expect(findTimes).toBe(2);

    findTimes = 0;
    expect(binaryFind(arr, (o) => (findTimes++, 6 - o.item.id))).toEqual({ id: 6, text: '6' });
    expect(findTimes).toBe(2);

    findTimes = 0;
    expect(binaryFind(arr, (o) => (findTimes++, 7 - o.item.id))).toEqual(null);
    expect(findTimes).toBe(2);

    // cover
    expect(binaryFind([1], (i) => i.item)).toBe(null);
    expect(find(55).value).toBe(null);
    expect(find(400).value).toBe(null);
    expect(binaryFind([], (i) => i.item)).toBe(null);
  });
  test('insertToArray', () => {
    const arr1 = [1, 2, 3, 4];
    const arr2 = [1, 2, 3, 4];
    const arr3 = [1, 2, 3, 4];
    const arr4 = [1, 2, 3, 4];
    const arr5 = [1, 2, 4, 5];
    const arr6 = [1, 2, 4, 5];
    const arr7 = [1, 2, 4, 5];
    expect(insertToArray(5, 1, arr1)).toBe(1);
    expect(arr1).toEqual([1, 5, 2, 3, 4]);
    expect(insertToArray([6, 7], 100, arr1)).toBe(5);
    expect(arr1).toEqual([1, 5, 2, 3, 4, 6, 7]);

    expect(insertToArray(5, 1, arr2, { after: true })).toBe(2);
    expect(arr2).toEqual([1, 2, 5, 3, 4]);
    expect(insertToArray(0, -1, arr2)).toBe(4);
    expect(arr2).toEqual([1, 2, 5, 3, 0, 4]);
    expect(insertToArray(6, 100, arr2, { after: true })).toBe(6);
    expect(arr2).toEqual([1, 2, 5, 3, 0, 4, 6]);

    expect(insertToArray(6, (v) => v.item === 100, arr2)).toBe(-1);
    expect(arr2).toEqual([1, 2, 5, 3, 0, 4, 6]);

    expect(insertToArray(5, 0, arr3)).toBe(0);
    expect(arr3).toEqual([5, 1, 2, 3, 4]);
    expect(insertToArray(5, 100, arr4)).toBe(4);
    expect(insertToArray(6, 100, arr4)).toBe(5);
    expect(arr4).toEqual([1, 2, 3, 4, 5, 6]);

    expect(insertToArray(3, (v) => v.item === 2, arr5)).toBe(1);
    expect(arr5).toEqual([1, 3, 2, 4, 5]);
    expect(insertToArray(3, (v) => v.item > 2, arr6)).toBe(2);
    expect(arr6).toEqual([1, 2, 3, 4, 5]);
    expect(insertToArray(6, (v) => v.item === 1000, arr6)).toBe(-1);
    expect(arr6).toEqual([1, 2, 3, 4, 5]);

    const a2: number[] = [];
    expect(
      insertToArray(3, ({ item, insert }) => (a2.push(item), item < insert), arr7, {
        reverse: true,
        after: true,
      }),
    ).toBe(2);
    expect(a2).toEqual([5, 4, 2]);
    expect(arr7).toEqual([1, 2, 3, 4, 5]);

    const arr8 = [1, 2, 4, 5];
    const a3: number[] = [];
    expect(
      insertToArray(
        [3, 3],
        (options) => {
          a3.push(options.item);
          return options.item > options.inserts[0]!;
        },
        arr8,
      ),
    ).toBe(2);
    expect(a3).toEqual([1, 2, 4]);
    expect(arr8).toEqual([1, 2, 3, 3, 4, 5]);
  });
  test('insertToArray2', () => {
    let arr: number[];

    // 插入单个 静态位置
    arr = [1, 2, 3, 2];
    expect(insertToArray(5, 1, arr)).toBe(1);
    expect(arr).toEqual([1, 5, 2, 3, 2]);
    // 恢复
    arr = [1, 2, 3, 2];
    // 插到目标位置后面
    expect(insertToArray(5, 1, arr, { after: true })).toBe(2);
    expect(arr).toEqual([1, 2, 5, 3, 2]);
    // 恢复
    arr = [1, 2, 3, 2];
    // 负号位置
    expect(insertToArray(5, -1, arr, { after: false })).toBe(3);
    expect(arr).toEqual([1, 2, 3, 5, 2]);

    // 插入多个 静态位置
    arr = [1, 2, 3, 2];
    expect(insertToArray([5, 6], 1, arr)).toBe(1);
    expect(arr).toEqual([1, 5, 6, 2, 3, 2]);
    // 恢复
    arr = [1, 2, 3, 2]!;
    // 插到目标位置后面
    expect(insertToArray([5, 6], 1, arr, { after: true })).toBe(2);
    expect(arr).toEqual([1, 2, 5, 6, 3, 2]);
    // 恢复
    arr = [1, 2, 3, 2];
    // 负号位置
    expect(insertToArray([5, 6], -1, arr, { after: false })).toBe(3);
    expect(arr).toEqual([1, 2, 3, 5, 6, 2]);

    // 插入单个 动态位置
    arr = [1, 2, 3, 2];
    expect(insertToArray(5, (o) => o.item === 2, arr)).toBe(1);
    expect(arr).toEqual([1, 5, 2, 3, 2]);
    // 恢复
    arr = [1, 2, 3, 2];
    // 插到目标位置后面
    expect(insertToArray(5, (o) => o.item === 2, arr, { after: true })).toBe(2);
    expect(arr).toEqual([1, 2, 5, 3, 2]);
    // 恢复
    arr = [1, 2, 3, 2];
    // 反向查找
    expect(insertToArray(5, (o) => o.item === 2, arr, { after: false, reverse: true })).toBe(3);
    expect(arr).toEqual([1, 2, 3, 5, 2]);

    // 插入多个个 动态位置
    arr = [1, 2, 3, 2];
    expect(insertToArray([5, 5], (o) => o.item === 2, arr)).toBe(1);
    expect(arr).toEqual([1, 5, 5, 2, 3, 2]);
    // 恢复
    arr = [1, 2, 3, 2];
    // 插到目标位置后面
    expect(insertToArray([5, 5], (o) => o.item === 2, arr, { after: true })).toBe(2);
    expect(arr).toEqual([1, 2, 5, 5, 3, 2]);
    // 恢复
    arr = [1, 2, 3, 2];
    // 反向查找
    expect(insertToArray([5, 5], (o) => o.item === 2, arr, { reverse: true })).toBe(3);
    expect(arr).toEqual([1, 2, 3, 5, 5, 2]);
  });
  test('arrayRemoveItem', () => {
    const a1 = [1, 2, 3, 4, 5];

    expect(arrayRemoveItem(a1, 100)).toBe(undefined);
    expect(a1).toEqual([1, 2, 3, 4, 5]);
    expect(arrayRemoveItem(a1, 1)).toBe(1);
    expect(a1).toEqual([2, 3, 4, 5]);
  });
  test('arrayRemoveItemsBy', () => {
    const a1 = [1, 2, 3, 4, 5];

    expect(arrayRemoveItemsBy(a1, (v) => v === 100)).toEqual([]);
    expect(a1).toEqual([1, 2, 3, 4, 5]);
    expect(arrayRemoveItemsBy(a1, (v) => v === 1)).toEqual([1]);
    expect(a1).toEqual([2, 3, 4, 5]);
  });
  test('unique', () => {
    expect(unique([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1])).toEqual([1, 2, 3, 4]);
    expect(unique([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(unique([NaN, null, undefined, ''])).toEqual([NaN, null, undefined, '']);
    expect(unique([undefined, undefined, ''])).toEqual([undefined, '']);
    expect(unique([NaN, NaN])).toEqual([NaN]);
    expect(unique([NaN, NaN], (a, b) => Number.isNaN(a) && Number.isNaN(b))).toEqual([NaN]);
    const a = { value: 1 };
    const b = { value: 2 };
    const c = { value: 3 };
    const d = { value: 2 };
    expect(unique([a, b, c, d])).toEqual([a, b, c, d]);
    expect(unique([])).toEqual([]);
    expect(unique([a, b, c, d], (v1, v2) => v1.value === v2.value)).toEqual([a, b, c]);
  });
  test('chunk', () => {
    expect(chunk([0, 1, 2, 3, 4, 5, 6], 10)).toEqual([[0, 1, 2, 3, 4, 5, 6]]);
    expect(chunk([0, 1, 2, 3, 4, 5, 6], 1)).toEqual([[0], [1], [2], [3], [4], [5], [6]]);
    expect(chunk([0, 1, 2, 3, 4, 5, 6], 0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(chunk([0, 1, 2, 3, 4, 5, 6], -1)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(chunk([0, 1, 2, 3, 4, 5, 6], 3)).toEqual([[0, 1, 2], [3, 4, 5], [6]]);
    expect(chunk([0, 1, 2, 3, 4, 5], 3)).toEqual([
      [0, 1, 2],
      [3, 4, 5],
    ]);
    expect(chunk([0, 1, 2, 3, 4], 3)).toEqual([
      [0, 1, 2],
      [3, 4],
    ]);
    const emptyArr: any[] = [];
    expect(chunk(emptyArr, 3)).toEqual([]);
    expect(chunk(emptyArr, 3) === emptyArr).toBe(false);
    expect(chunk({} as any, 3)).toEqual([]);

    expect(() => chunk(null as any, 3)).toThrow();
  });

  test('inRange', () => {
    expect(inRange(0, [undefined as any, 100])).toBe(true);
    expect(inRange(0, [0])).toBe(true);
    expect(inRange(0, [1])).toBe(false);
    expect(inRange(0, [1, 2])).toBe(false);
  });
  test('inRanges', () => {
    expect(inRanges(0, [undefined as any, 100])).toBe(true);
    expect(inRanges(0, [0])).toBe(true);
    expect(inRanges(0, [1])).toBe(false);
    expect(inRanges(0, [1, 2])).toBe(false);

    expect(inRanges(0, [1, 2], [-9, -1])).toBe(false);
    expect(inRanges(-9, [1, 2], [-9, -1])).toBe(true);
    expect(inRanges(-1, [1, 2], [-9, -1])).toBe(true);
    expect(inRanges(-10, [1, 2], [-9, -1])).toBe(false);
    expect(inRanges(-10, [1, 2], [-9, -1], [-20, -10])).toBe(true);
    expect(inRanges(0, [1, 2], [-9, -1])).toBe(false);
  });
  test('groupBy', () => {
    expect(groupBy([{ type: 1 }, { type: 2 }], 'type')).toEqual({
      1: [{ type: 1 }],
      2: [{ type: 2 }],
    });
    expect(
      groupBy(
        [
          { type: 1, value: 111 },
          { type: 2, value: 222 },
          { type: 1, value: 222 },
          { type: 2, value: 33344 },
          { type: 1, value: 333 },
          { type: 1, value: 444 },
        ],
        'type',
      ),
    ).toEqual({
      1: [
        { type: 1, value: 111 },
        { type: 1, value: 222 },
        { type: 1, value: 333 },
        { type: 1, value: 444 },
      ],
      2: [
        { type: 2, value: 222 },
        { type: 2, value: 33344 },
      ],
    });
    expect(groupBy([], '')).toEqual({});
    expect(() => {
      groupBy(undefined as any, undefined as any);
    }).toThrowError();
    expect(groupBy([], undefined as any)).toEqual({});
    expect(groupBy([{ type: 1 }, { type: 2 }], undefined as any)).toEqual({
      '*': [{ type: 1 }, { type: 2 }],
    });
    expect(groupBy([{ type: 1 }, { value: 2 }], 'type')).toEqual({
      '*': [{ value: 2 }],
      1: [{ type: 1 }],
    });
    expect(groupBy([{ type: 1 }, { value: 2 }], 'type', 'other')).toEqual({
      other: [{ value: 2 }],
      1: [{ type: 1 }],
    });

    // cb
    expect(
      groupBy(
        [
          { name: 'a', score: 50 },
          { name: 'b', score: 90 },
          { name: 'c', score: 70 },
          { name: 'd', score: 10 },
          { name: 'e', score: 100 },
        ],
        (item) => {
          const score = item.score;
          if (score >= 90) return 'A';
          if (score >= 60) return 'B';
          return 'C';
        },
      ),
    ).toEqual({
      A: [
        { name: 'b', score: 90 },
        { name: 'e', score: 100 },
      ],
      B: [{ name: 'c', score: 70 }],
      C: [
        { name: 'a', score: 50 },
        { name: 'd', score: 10 },
      ],
    });

    const list = [
      { code: 'a' },
      { code: 'a_a' },
      { code: 'a_b' },
      { code: 'a_c' },
      { code: 'b' },
      { code: 'b_a' },
      { code: 'b_b' },
    ];

    const r = groupBy(list, (item, obj) => {
      let result = '';
      forEachObj(
        obj,
        (_v, k): false | void => {
          if (new RegExp((k as string) + '_.+').test(item.code)) {
            result = k as string;
            return false;
          }
        },
        () => (result = item.code),
      );
      return result;
    });

    expect(r).toEqual({
      a: [{ code: 'a' }, { code: 'a_a' }, { code: 'a_b' }, { code: 'a_c' }],
      b: [{ code: 'b' }, { code: 'b_a' }, { code: 'b_b' }],
    });
  });
  test('someInList', () => {
    expect(someInList([0, 20, 100], [...Array(10).keys()])).toBe(true);
    expect(someInList([500, 20], Array.from({ length: 10 }))).toBe(false);
    expect(someInList([{ id: 1 }], [{ id: 1 }, { id: 2 }, { id2: 3 }])).toBe(false);
    const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(
      someInList([{ id: 1 }], list, (item, _i, list) => list.some((s) => s.id === item.id)),
    ).toBe(true);
  });
});