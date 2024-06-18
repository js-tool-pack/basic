import {
  getYangHuiTriangleOne,
  arrayRemoveItemsBy,
  getYangHuiTriangle,
  binaryFindIndex,
  arrayRemoveItem,
  findIndexRight,
  insertToArray,
  forEachAround,
  forEachRight,
  createArray,
  forEachObj,
  binaryFind,
  someInList,
  findIndex,
  castArray,
  joinArray,
  inRanges,
  forEach,
  isEqual,
  inRange,
  groupBy,
  unique,
  chunk,
  sum,
  avg,
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
        fill(item, index) {
          return item + '' + index;
        },
        start: 3,
        len: 5,
        end: 5,
      }),
    ).toEqual(['30', '41']);
    expect(createArray({ start: 3, fill: 0, len: 5, end: 6 })).toEqual([0, 0, 0]);

    // 测试fill参数
    const fn = jest.fn((a) => a);

    // end为len
    createArray({ fill: fn, len: 5 });
    expect(fn.mock.calls).toEqual([
      [0, 0, 5],
      [1, 1, 5],
      [2, 2, 5],
      [3, 3, 5],
      [4, 4, 5],
    ]);

    fn.mock.calls.length = 0;

    // end为start+len
    createArray({ start: 3, fill: fn, len: 5 });
    expect(fn.mock.calls).toEqual([
      [3, 0, 8],
      [4, 1, 8],
      [5, 2, 8],
      [6, 3, 8],
      [7, 4, 8],
    ]);

    fn.mock.calls.length = 0;

    // end为end
    createArray({ start: 2, fill: fn, end: 3 });
    expect(fn.mock.calls).toEqual([[2, 0, 3]]);
  });
  test('forEach', () => {
    const arr1 = [1, 2, 3];
    let isDone = forEach(arr1, (_v, k) => (arr1[k] = k));
    expect(isEqual(arr1, [0, 1, 2])).toBe(true);
    expect(isDone).toBe(true);

    // ArrayLike
    isDone = forEach({ length: 2, 0: 1, 1: 2 }, (_v, k) => (arr1[k] = k + k));
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
      createArray({ start: 10, end: 20 }).reduce(
        (obj, v) => {
          obj[v] = v;
          return obj;
        },
        {} as Record<string, any>,
      ),
    );

    const result2: any[] = [];
    forEachRight(createArray({ len: 20 }), (v, k) => {
      result2.push({ [k]: v });
      if (k === 15) return false;
      return;
    });

    expect(result2).toEqual([{ 19: 19 }, { 18: 18 }, { 17: 17 }, { 16: 16 }, { 15: 15 }]);

    let elseCount = 0;
    const isDone = forEachRight(
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
      index: ReturnType<typeof binaryFindIndex>;
      times: number;
    } {
      // 查找次数
      let times = 0;
      const index = binaryFindIndex(list, function ({ index, start, item, end }) {
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

    function find(target: number): { value: ReturnType<typeof binaryFind>; times: number } {
      let times = 0;
      const value = binaryFind(list, ({ index, item }) => {
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
      { text: '1', id: 1 },
      { text: '2', id: 2 },
      { text: '3', id: 3 },
      { text: '4', id: 4 },
      { text: '5', id: 5 },
      { text: '6', id: 6 },
    ];

    expect(binaryFind(arr, (o) => (findTimes++, 3 - o.item.id))).toEqual({ text: '3', id: 3 });
    expect(findTimes).toBe(3);

    findTimes = 0;
    expect(binaryFind(arr, (o) => (findTimes++, 2 - o.item.id))).toEqual({ text: '2', id: 2 });
    expect(findTimes).toBe(2);

    findTimes = 0;
    expect(binaryFind(arr, (o) => (findTimes++, 6 - o.item.id))).toEqual({ text: '6', id: 6 });
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
      insertToArray(3, ({ insert, item }) => (a2.push(item), item < insert), arr7, {
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
    expect(insertToArray(5, (o) => o.item === 2, arr, { reverse: true, after: false })).toBe(3);
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
    // 不支持-1

    // @ts-expect-error
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

    expect(chunk(new Uint8ClampedArray([0, 1, 2, 3, 4, 5]), 2)).toEqual([
      [0, 1],
      [2, 3],
      [4, 5],
    ]);
    expect(chunk({ length: 6 }, 2)).toEqual([
      [undefined, undefined],
      [undefined, undefined],
      [undefined, undefined],
    ]);
  });

  test('inRange', () => {
    expect(inRange(0, [undefined as any, 100])).toBe(true);
    expect(inRange(0, [0])).toBe(true);
    expect(inRange(0, [1])).toBe(false);
    expect(inRange(0, [1, 2])).toBe(false);
    expect(inRange(NaN, [0])).toBe(false);
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
    expect(groupBy({ 0: { type: 1 }, 1: { type: 2 }, length: 2 }, 'type')).toEqual({
      1: [{ type: 1 }],
      2: [{ type: 2 }],
    });
    expect(
      groupBy(
        [
          { value: 111, type: 1 },
          { value: 222, type: 2 },
          { value: 222, type: 1 },
          { value: 33344, type: 2 },
          { value: 333, type: 1 },
          { value: 444, type: 1 },
        ],
        'type',
      ),
    ).toEqual({
      1: [
        { value: 111, type: 1 },
        { value: 222, type: 1 },
        { value: 333, type: 1 },
        { value: 444, type: 1 },
      ],
      2: [
        { value: 222, type: 2 },
        { value: 33344, type: 2 },
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
    const a = groupBy([{ a: 50 }, { a: 90 }, { a: 70 }], 'a');
    expect([a['*'], a['50'], a['70'], a['90']]).toEqual([
      undefined,
      [{ a: 50 }],
      [{ a: 70 }],
      [{ a: 90 }],
    ]);
    // 测试体操获取属性是否报错
    // @ts-expect-error
    expect(a['**']).toBe(undefined);
    // @ts-expect-error
    expect(a['1']).toBe(undefined);

    // cb
    expect(
      groupBy(
        [
          { name: 'a', score: 50 },
          { name: 'b', score: 90 },
          { name: 'c', score: 70 },
          { name: 'd', score: 10 },
          { score: 100, name: 'e' },
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
        { score: 100, name: 'e' },
      ],
      C: [
        { name: 'a', score: 50 },
        { name: 'd', score: 10 },
      ],
      B: [{ name: 'c', score: 70 }],
    });

    const b = groupBy([50, 90, 70, 10, 100], (score) => {
      if (score >= 90) return 'A';
      if (score >= 60) return 'B';
      return 'C';
    });
    expect([b['*'], b.A, b.B, b.C]).toEqual([undefined, [90, 100], [70], [50, 10]]);

    const c = groupBy(
      [50, 90, 70, 10, 100],
      (score): void | 'A' | 'B' => {
        if (score >= 90) return 'A';
        if (score >= 60) return 'B';
      },
      'C',
    );
    expect([c.A, c.B, c.C]).toEqual([[90, 100], [70], [50, 10]]);
    // C 替代了 *
    // @ts-expect-error
    expect(c['*']).toBe(undefined);

    expect(
      groupBy([50, 90, 70, 10, 100], (score) => {
        if (score >= 90) return 'A';
        if (score >= 60) return 'B';
        return 'C';
      }),
    ).toEqual({
      A: [90, 100],
      C: [50, 10],
      B: [70],
    });
    expect(
      groupBy(
        [50, 90, 70, 10, 100],
        (score): string | void => {
          if (score >= 90) return 'A';
          if (score >= 60) return 'B';
        },
        'C',
      ),
    ).toEqual({
      A: [90, 100],
      C: [50, 10],
      B: [70],
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
  test('sum', () => {
    expect(sum([0, 20, 100])).toBe(120);
    expect(sum([-10, 20, 100])).toBe(110);
  });
  test('avg', () => {
    expect(avg([20, 20, 20])).toBe(20);
    expect(avg([-10, 20, 20])).toBe(10);
  });
  const yh = [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1],
    [1, 5, 10, 10, 5, 1],
    [1, 6, 15, 20, 15, 6, 1],
    [1, 7, 21, 35, 35, 21, 7, 1],
    [1, 8, 28, 56, 70, 56, 28, 8, 1],
    [1, 9, 36, 84, 126, 126, 84, 36, 9, 1],
  ];
  test('getYangHuiTriangleOneFloor', () => {
    expect(getYangHuiTriangleOne(0)).toEqual([]);
    expect(getYangHuiTriangleOne(1)).toEqual(yh[0]);

    yh.forEach((item, i) => {
      expect(getYangHuiTriangleOne(i + 1)).toEqual(item);
    });

    expect(getYangHuiTriangleOne(10)).toEqual(yh[9]);
    expect(getYangHuiTriangleOne(6)).toEqual([1, 5, 10, 10, 5, 1]);
    expect(getYangHuiTriangleOne(10)).toEqual([1, 9, 36, 84, 126, 126, 84, 36, 9, 1]);
  });
  test('getYangHuiTriangle', () => {
    expect(getYangHuiTriangle(1)).toEqual(yh.slice(0, 1));
    expect(getYangHuiTriangle(10)).toEqual(yh.slice());
  });
  test('forEachAround', () => {
    const arr = [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
    ];

    const res: number[] = [];
    const indexes: [number, number][] = [];

    forEachAround(arr, (v, i) => (res.push(v), indexes.push(i)));
    expect(res).toEqual([
      1, 2, 3, 4, 5, 10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6, 7, 8, 9, 14, 19, 18, 17, 12, 13,
    ]);
    expect(indexes).toEqual(
      JSON.parse(`[
      [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 4], [2, 4], [3, 4], [4, 4], [4, 3],
      [4, 2], [4, 1], [4, 0], [3, 0], [2, 0],
      [1, 0], [1, 1], [1, 2], [1, 3], [2, 3],
      [3, 3], [3, 2], [3, 1], [2, 1], [2, 2]
    ]`),
    );

    res.length = 0;
    indexes.length = 0;
    forEachAround(arr, (v, i) => (res.push(v), indexes.push(i)), { reverse: true });
    expect(res).toEqual([
      1, 6, 11, 16, 21, 22, 23, 24, 25, 20, 15, 10, 5, 4, 3, 2, 7, 12, 17, 18, 19, 14, 9, 8, 13,
    ]);
    expect(indexes).toEqual(
      JSON.parse(`[
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
      [4, 1], [4, 2], [4, 3], [4, 4], [3, 4],
      [2, 4], [1, 4], [0, 4], [0, 3], [0, 2],
      [0, 1], [1, 1], [2, 1], [3, 1], [3, 2],
      [3, 3], [2, 3], [1, 3], [1, 2], [2, 2]
    ]`),
    );

    res.length = 0;
    // 只遍历最外面一圈
    forEachAround(arr, (v, i): false | void => {
      if (i[0] === 1 && i[1] === 1) return false;
      res.push(v);
    });
    expect(res).toEqual([1, 2, 3, 4, 5, 10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6]);

    res.length = 0;
    // 只遍历最外面一圈,并且跳过第一层
    forEachAround(arr, (v, i): false | void => {
      if (i[0] === 0 && i[1] === 0) {
        // 移动到第二行倒数第二列
        i[0] = 1;
        i[1] = 3;
        return;
      }
      if (i[0] === 1 && i[1] === 1) return false;
      res.push(v);
    });
    expect(res).toEqual([10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6]);

    res.length = 0;
    // 只遍历最外面一圈,并且跳过第一层（使用startIndexes和startDirect）
    forEachAround(
      arr,
      (v, i): false | void => {
        res.push(v);
        if (i[0] === 0 && i[1] === 0) return false;
      },
      { startDirect: 'bottom', startIndexes: [1, 4] },
    );
    expect(res).toEqual([10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6, 1]);

    res.length = 0;
    // 从第一行的第三个开始
    forEachAround(arr, (v) => res.push(v), { startIndexes: [0, 2] });
    expect(res).toEqual([
      3, 4, 5, 10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6, 7, 8, 9, 14, 19, 18, 17, 12, 13,
    ]);

    res.length = 0;
    // 从第一行的第三个开始，反向
    forEachAround(arr, (v) => res.push(v), {
      startIndexes: [0, 2],
      startDirect: 'left',
      reverse: true,
    });
    expect(res).toEqual([
      3, 2, 1, 6, 11, 16, 21, 22, 23, 24, 25, 20, 15, 10, 9, 8, 7, 12, 17, 18, 19, 14, 13,
    ]);

    res.length = 0;
    // 下标越界
    forEachAround(arr, (v) => res.push(v), { startIndexes: [10, 10], startDirect: 'bottom' });
    expect(JSON.stringify(res)).toBe('[]');

    // 空数组
    forEachAround([], (v: any) => res.push(v), { startIndexes: [10, 10], startDirect: 'bottom' });
    expect(JSON.stringify(res)).toBe('[]');
  });

  test('joinArray', () => {
    expect(joinArray([1, 2, 3], 0)).toEqual([1, 0, 2, 0, 3]);
    expect(joinArray([1], 0)).toEqual([1]);
    expect(joinArray([1, 2], 0)).toEqual([1, 0, 2]);
    expect(joinArray<number | string>([1, 2, 3], 'a')).toEqual([1, 'a', 2, 'a', 3]);
    expect(joinArray([1, 2, 3], 0, (it) => it + 10)).toEqual([11, 0, 12, 0, 13]);
    expect(joinArray([1, 2, 3], 0, (it, i) => it + i)).toEqual([1, 0, 4, 0, 7]);

    // fn
    expect(joinArray([1, 2, 3], (i) => i + 10)).toEqual([1, 11, 2, 13, 3]);
    expect(
      // @ts-expect-error
      joinArray([1, 2, 3], (i) => i + '10'),
    ).toEqual([1, '110', 2, '310', 3]);
    expect(joinArray<string | number>([1, 2, 3], (i) => i + '10')).toEqual([1, '110', 2, '310', 3]);
    expect(
      joinArray(
        [1, 2, 3],
        (i) => i + 10,
        (it) => it + 100,
      ),
    ).toEqual([101, 11, 102, 13, 103]);
    expect(
      joinArray(
        [1, 2, 3],
        (it) => it + 10,
        (it, i) => it + i,
      ),
    ).toEqual([1, 11, 4, 13, 7]);

    // edge
    expect(joinArray([], 0)).toEqual([]);
  });
});
