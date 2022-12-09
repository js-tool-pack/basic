import { typeOf, isNaN, isArray, isFunction } from '../data-type';
import { hasOwn } from '../object';

/**
 * 创建数组
 *
 * len与end两个都有值时，以小的为准
 * @example
 * // returns [0, 1]
 * createArray({end: 2});
 * @example
 * // returns [0, 1]
 * createArray({start: 0, end: 2});
 * @example
 * // [1, 1]
 * createArray({start:0, end:2, len:2, fill:1});
 * @example
 * // returns [1, 2]
 * createArray(start: 0, len: 2, fill: item => item+1);
 */
export function createArray<T = number>({
  start = 0,
  end,
  len,
  fill,
}: {
  start?: number;
  end?: number;
  len?: number;
  fill?: T | ((item: number, index: number) => T);
}): T[] {
  let e: number = start;
  if (len && end) {
    e = Math.min(start + len, end);
  } else {
    if (len !== undefined) {
      e = start + len;
    }
    if (end !== undefined) {
      e = end;
    }
  }
  let callback: (item: number, index: number) => any;
  switch (typeOf(fill)) {
    case 'function':
      callback = fill as typeof callback;
      break;
    case 'undefined':
    case 'null':
      callback = (i) => i;
      break;
    default:
      callback = () => fill;
  }
  const arr: any[] = [];
  for (let item = start, index = 0; item < e; item++, index++) {
    arr.push(callback(item, index));
  }
  return arr;
}

// 注意：写成下面这种方式(把ArrayLike<T>提取到范型A):
// function forEach<T, A extends ArrayLike<T>>(
//   arr: A,
//   callbackFn: (value: T, index: number, array: A) => any | false,
//   elseCB?: () => void,
// ): boolean
// 在使用时回调函数的value是不会有类型推导的，value类型将是 unknown

// ie9支持
// forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
/**
 * 遍历数组，并不完全等同 Array.prototype.forEach，该forEach支持中断，支持类似Python的for else功能
 *
 * Python的for else hack写法
 *
 * ```ts
 * try {
 *   [1, 2, 3, 4, 5].forEach((item, index) => {
 *     \/* do something *\/
 *     if (index === 2 && item === 3) {
 *       // break;
 *       throw new Error('break');
 *     }
 *   });
 *   \/* do else *\/
 * } catch (e: any) {
 *   if (e.message !== 'break') throw e;
 * }
 * ```
 *
 * @example
 * const arr1 = [1, 2, 3];
 * let isDone = forEach(arr1, (_v, k) => (arr1[k] = k));
 * isEqual(arr1, [0, 1, 2]); // true
 * isDone; // true
 *
 * // ArrayLike
 * isDone = forEach({ 0: 1, 1: 2, length: 2 }, (_v, k) => (arr1[k] = k + k));
 * isEqual(arr1, [0, 2, 2]); // true
 * isDone; // true
 *
 * isDone = forEach(arr1, (_v, k) => {
 *   arr1[k] = k + 1;
 *   return k !== 1;
 * });
 * isDone; // false
 * isEqual(arr1, [1, 2, 2]); // true
 *
 * let elseCount = 0;
 * isDone = forEach(
 *   arr2,
 *   (v, k) => (arr2[k] = 'a' + v),
 *   () => elseCount++, // 完整遍历以后会执行该方法
 * );
 * isDone; // true
 * elseCount; // 1
 *
 * @param arr 数组
 * @param callbackFn 该回调如果返回false则会中断遍历
 * @param elseCB 类似于Python的for else中的else，
 *        只会在完整的遍历后执行，如果break则不会触发
 * @returns {boolean} isDone 是否遍历完成
 */
export function forEach<T>(
  arr: ArrayLike<T>,
  callbackFn: (value: T, index: number, array: ArrayLike<T>) => any | false,
  elseCB?: () => void,
): boolean {
  // 不能直接把arr.length放进循环，否则在循环里新增的话length会变长,原生的不会变长
  const len = arr.length || 0;
  // if (!isArrayLike(arr)) throw new TypeError();
  for (let i = 0; i < len; i++) {
    if (callbackFn(arr[i] as T, i, arr) === false) return false;
  }
  elseCB && elseCB();
  return true;
}

/**
 * forEach的反向遍历版本
 *
 * @example
 *
 * const arr: number[] = [];
 * forEachRight([1, 2, 3, 4], (i) => arr.push(i + 1));
 * isEqual(arr, [5, 4, 3, 2]); // true
 *
 * const result: any = {};
 * forEachRight(createArray({ len: 20 }), (v, k) => {
 *   result[k] = v;
 *   if (k === 10) return false;
 *   return;
 * });
 * isEqual(result,
 *   createArray({ start: 10, end: 20 }).reduce((obj, v) => {
 *     obj[v] = v;
 *     return obj;
 *   }, {} as Record<string, any>),
 * )); // true
 *
 * const result2: any[] = [];
 * forEachRight(createArray({ len: 20 }), (v, k) => {
 *   result2.push({ [k]: v });
 *   if (k === 15) return false;
 *   return;
 * });
 *
 * isEqual(result2, [{ 19: 19 }, { 18: 18 }, { 17: 17 }, { 16: 16 }, { 15: 15 }]); // true
 *
 * let elseCount = 0;
 * const isDone = forEachRight(
 *   arr,
 *   () => {},
 *   () => elseCount++, // 完整遍历以后会执行该方法
 * );
 * isDone; // true
 * elseCount; // 1
 */
export function forEachRight<T>(
  arr: ArrayLike<T>,
  callbackFn: (value: T, index: number, array: ArrayLike<T>) => any | false,
  elseCB?: () => void,
): boolean {
  for (let i = arr.length - 1; i > -1; i--) {
    if (callbackFn(arr[i] as T, i, arr) === false) return false;
  }
  elseCB && elseCB();
  return true;
}

/**
 * 判断value是否是数组，如果是数组就返回value否则返回[value]
 *
 * @example
 * castArray([1]); // [1]
 * castArray(1); // [1]
 */
export function castArray<T>(value: T): T extends Array<any> ? T : Array<T> {
  return (isArray(value) ? value : [value]) as any;
}

/**
 * 在跟Array.prototype.findIndex基础上添加对ArrayLike支持，且可以跟findIndexRight配套使用
 *
 * @example
 *
 *  // 中途删除
 * const i = [1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1].findIndex((v, index, a) => {
 *   if (v === 1) a.splice(index, 1);
 *   return v === 4;
 * });
 * i; // 3
 *
 * const i2 = findIndex([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1], (v, index, a) => {
 *   if (v === 1) (a as number[]).splice(index, 1);
 *   return v === 4;
 * });
 * i2; // 3
 *
 * findIndex([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1], (v) => v === 4); // 5
 * findIndex([{ v: 1 }, { v: 2 }], (v) => v.v === 4); // -1
 * findIndex([{ v: 1 }, { v: 2 }], (v) => v.v === 2); // 1
 *
 * findIndex([], undefined as any); // -1
 *
 */
export function findIndex<T>(
  arr: ArrayLike<T>,
  predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean,
): number {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const item = arr[i] as T;
    if (predicate(item, i, arr as any)) return i;
  }
  return -1;
}

/**
 * findIndex反向遍历版本
 *
 * @example
 * const list = [1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1];
 * const result: number[] = [];
 * const i = findIndexRight(list, (v) => (result.push(v), v === 4));
 * i; // 5
 * result; // [1, 1, 1, 1, 1, 4]
 * findIndexRight([{ v: 1 }, { v: 2 }], (v) => v.v === 4); // -1
 * findIndexRight([{ v: 1 }, { v: 2 }], (v) => v.v === 2); // 1
 *
 * findIndexRight([], undefined as any); // -1
 */
export function findIndexRight<T>(
  arr: ArrayLike<T>,
  predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean,
): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = arr[i] as T;
    if (predicate(item, i, arr as any)) return i;
  }
  return -1;
}
/**
 * 二分查找item index
 *
 * @example
 *
 *  let findTimes = 0;
 * const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
 *
 * binaryFindIndex(arr, (o) => (findTimes++, 3 - o.item.id)); // id等于3的item的index是2
 * findTimes; // 查找遍历次数：3
 *
 * findTimes = 0;
 * binaryFindIndex(arr, (o) => (findTimes++, 2 - o.item.id)); // id等于2的item的index是1
 * findTimes; // 查找遍历次数：2
 *
 * findTimes = 0;
 * binaryFindIndex(arr, (o) => (findTimes++, 6 - o.item.id)); // id等于6的item的index是5
 * findTimes; // 查找遍历次数：2
 *
 * findTimes = 0;
 * binaryFindIndex(arr, (o) => (findTimes++, 7 - o.item.id)); // id等于7的item的index是-1
 * findTimes; // 查找遍历次数：2
 *
 * @param arr 要查找的数组
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 */
export function binaryFindIndex<T>(
  arr: T[],
  handler: (options: { item: T; index: number; start: number; end: number; arr: T[] }) => number,
): number {
  if (arr.length === 0) return -1;
  let start = 0;
  let end = arr.length;

  do {
    const middleIndex = Math.floor((end - start) / 2) + start;
    const value: number = handler({
      item: arr[middleIndex] as T,
      index: middleIndex,
      start,
      end,
      arr,
    });

    if (value === 0) {
      return middleIndex;
    } else if (value > 0) {
      start = middleIndex + 1;
    } else {
      end = middleIndex;
    }
  } while (end > start);

  return -1;
}

/**
 * 二分查找item
 *
 * @see binaryFindIndex
 *
 * @example
 *
 * let findTimes = 0;
 * const arr = [
 *   { id: 1, text: '1' },
 *   { id: 2, text: '2' },
 *   { id: 3, text: '3' },
 *   { id: 4, text: '4' },
 *   { id: 5, text: '5' },
 *   { id: 6, text: '6' },
 * ];
 *
 * binaryFind(arr, (o) => (findTimes++, 3 - o.item.id)); // { id: 3, text: '3' }
 * findTimes; // 查找遍历次数：3
 *
 * findTimes = 0;
 * binaryFind(arr, (o) => (findTimes++, 2 - o.item.id)); // { id: 2, text: '2' }
 * findTimes; // 查找遍历次数：2
 *
 * findTimes = 0;
 * binaryFind(arr, (o) => (findTimes++, 6 - o.item.id)); // { id: 6, text: '6' }
 * findTimes; // 查找遍历次数：2
 *
 * findTimes = 0;
 * binaryFind(arr, (o) => (findTimes++, 7 - o.item.id)); // null
 * findTimes; // 查找遍历次数：2
 *
 * @param arr 要查找的数组
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 */
export function binaryFind<T>(
  arr: T[],
  handler: (options: { item: T; index: number; start: number; end: number; arr: T[] }) => number,
): T | null {
  const index = binaryFindIndex(arr, handler);
  if (index === -1) return null;
  return arr[index as keyof typeof arr] as T;
}

/**
 * insertToArray函数回调参数类型声明
 */
export interface InsertToArrayToCBOptions<T = unknown> {
  item: T;
  index: number;
  array: T[];
  inserts: T[];
  insert: T;
}

/**
 * item插入到数组，在原数组中改变
 *
 * 插入单个，静态目标
 *
 * @example
 *
 * let arr: number[];
 *
 * // 插入单个 静态位置
 * arr = [1, 2, 3, 2];
 * insertToArray(5, 1, arr); // 1
 * arr; // [1, 5, 2, 3, 2]
 * // 恢复
 * arr = [1, 2, 3, 2];
 * // 插到目标位置后面
 * insertToArray(5, 1, arr, { after: true }); // 2
 * arr; // [1, 2, 5, 3, 2]
 * // 恢复
 * arr = [1, 2, 3, 2];
 * // 负号位置
 * insertToArray(5, -1, arr, { after: false }); // 3
 * arr; // [1, 2, 3, 5, 2]
 *
 * @param insert 插入的item
 * @param to 要插入的位置
 * @param array 要插入item的数组
 * @param param 可选参数
 * @param param.after 默认插到前面去
 * @returns 实际插入的位置
 */
export function insertToArray<T>(
  insert: T,
  to: number,
  array: T[],
  param?: {
    /**
     * 插入位置前后，true为后
     */
    after?: boolean;
  },
): number;
/**
 * item插入到数组，在原数组中改变
 *
 * 插入多个，静态目标
 *
 * @example
 *
 * // 插入多个 静态位置
 * arr = [1, 2, 3, 2];
 * insertToArray([5, 6], 1, arr); // 1
 * arr; // [1, 5, 6, 2, 3, 2]
 * // 恢复
 * arr = [1, 2, 3, 2]!;
 * // 插到目标位置后面
 * insertToArray([5, 6], 1, arr, { after: true }); // 2
 * arr; // [1, 2, 5, 6, 3, 2]
 * // 恢复
 * arr = [1, 2, 3, 2];
 * // 负号位置
 * insertToArray([5, 6], -1, arr, { after: false }); // 3
 * arr; // [1, 2, 3, 5, 6, 2]
 *
 * @param inserts 插入的items
 * @param to 要插入的位置
 * @param array 要插入item的数组
 * @param param 可选参数
 * @param param.after 默认插到前面去
 * @returns 实际插入的位置
 */
export function insertToArray<T>(
  inserts: T[],
  to: number,
  array: T[],
  param?: {
    /**
     * 插入位置前后，true为后
     */
    after?: boolean;
  },
): number;
/**
 * item插入到数组，在原数组中改变
 *
 * 插入单个，动态目标
 *
 * @example
 *
 * // 插入单个 动态位置
 * arr = [1, 2, 3, 2];
 * insertToArray(5, (o) => o.item === 2, arr); // 1
 * arr; // [1, 5, 2, 3, 2]
 * // 恢复
 * arr = [1, 2, 3, 2];
 * // 插到目标位置后面
 * insertToArray(5, (o) => o.item === 2, arr, { after: true }); // 2
 * arr; // [1, 2, 5, 3, 2]
 * // 恢复
 * arr = [1, 2, 3, 2];
 * // 反向查找
 * insertToArray(5, (o) => o.item === 2, arr, { after: false, reverse: true }); // 3
 * arr; // [1, 2, 3, 5, 2]
 *
 * @param insert 插入的item
 * @param toCB 查找要插入的位置回调
 * @param array 要插入item的数组
 * @param param 可选参数
 * @param param.after 默认插到前面去
 * @param param.reverse 是否反向遍历
 * @returns 实际插入的位置
 */
export function insertToArray<T>(
  insert: T,
  toCB: (options: Omit<InsertToArrayToCBOptions<T>, 'inserts'>) => boolean,
  array: T[],
  param?: {
    /**
     * 插入位置前后，true为后
     */
    after?: boolean;
    /**
     * 从前还是从后查起，true为前
     */
    reverse?: boolean;
  },
): number;

/**
 * item插入到数组，在原数组中改变
 *
 * 插入多个，动态目标
 *
 * @example
 *
 * // 插入多个个 动态位置
 * arr = [1, 2, 3, 2];
 * insertToArray([5, 5], (o) => o.item === 2, arr); // 1
 * arr; // [1, 5, 5, 2, 3, 2]
 * // 恢复
 * arr = [1, 2, 3, 2];
 * // 插到目标位置后面
 * insertToArray([5, 5], (o) => o.item === 2, arr, { after: true }); // 2
 * arr; // [1, 2, 5, 5, 3, 2]
 * // 恢复
 * arr = [1, 2, 3, 2];
 * // 反向查找
 * insertToArray([5, 5], (o) => o.item === 2, arr, { reverse: true }); // 3
 * arr; // [1, 2, 3, 5, 5, 2]
 *
 * @param inserts 插入的item
 * @param toCB 查找要插入的位置回调
 * @param array 要插入item的数组
 * @param param 可选参数
 * @param param.after 默认插到前面去
 * @param param.reverse 是否反向遍历
 * @returns 实际插入的位置
 */
export function insertToArray<T>(
  inserts: T[],
  toCB: (options: Omit<InsertToArrayToCBOptions<T>, 'insert'>) => boolean,
  array: T[],
  param?: {
    /**
     * 插入位置前后，true为后
     */
    after?: boolean;
    /**
     * 从前还是从后查起，true为前
     */
    reverse?: boolean;
  },
): number;

/**
 * item插入到数组，在原数组中改变
 * @param insert 插入的item
 * @param to 要插入的位置 如果to是函数的话没有找到则不会插进数组
 * @param array 要插入item的数组
 * @param option
 * @param option.after 默认插到前面去
 * @param option.reverse 是否反向遍历
 * @returns 实际插入的位置
 */
export function insertToArray(
  insert: unknown,
  to: number | Function,
  array: unknown[],
  { after = false, reverse = false } = {},
): number {
  const inserts = castArray(insert) as unknown[];
  let index = to as number;
  if (isFunction(to)) {
    index = (reverse ? findIndexRight : findIndex)(array, (v, k, a) => {
      const _options = { item: v, index: k, array: a };
      const options = Array.isArray(insert)
        ? ({ ..._options, inserts: insert as any[] } as Omit<InsertToArrayToCBOptions, 'insert'>)
        : ({ ..._options, insert } as Omit<InsertToArrayToCBOptions, 'inserts'>);

      return to(options);
    });
    if (index === -1) {
      return -1;
    }
  } else {
    if (to < 0) {
      index = array.length + to;
    } else if (to > array.length) {
      index = array.length - (after ? 1 : 0);
    }
  }
  after && index++;
  array.splice(index, 0, ...inserts);
  return index;
}

/**
 * 从数组中移除item
 *
 * @example
 *
 * const a1 = [1, 2, 3, 4, 5];
 *
 * arrayRemoveItem(a1, 100); // undefined
 * a1; // [1, 2, 3, 4, 5]
 * arrayRemoveItem(a1, 1); // 1
 * a1; // [2, 3, 4, 5]
 *
 */
export function arrayRemoveItem<T>(array: T[], item: T): void | T {
  const index = array.indexOf(item);
  if (index === -1) return;
  return array.splice(index, 1)[0];
}

/**
 * 从数组中移除多个item
 *
 * 没和arrayRemoveItem合并是因为无法区分function[]中的第二个参数是item还是，查找回调函数
 *
 * @example
 *
 * const a1 = [1, 2, 3, 4, 5];
 *
 * arrayRemoveItemsBy(a1, (v) => v === 100); // []
 * a1; // [1, 2, 3, 4, 5]
 * arrayRemoveItemsBy(a1, (v) => v === 1); // [1]
 * a1; // [2, 3, 4, 5]
 *
 */
export function arrayRemoveItemsBy<T>(
  array: T[],
  removeBy: (v: T, k: number, a: T[]) => boolean,
): T[] {
  const removedItems: T[] = [];
  forEachRight(array, (v: T, k, a) => {
    if (!removeBy(v, k, a as T[])) return;
    const item = array.splice(k, 1)[0] as T;
    removedItems.unshift(item);
  });
  return removedItems;
}

/**
 * 数组去重函数
 *
 * @example
 *
 * unique([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1]); // [1, 2, 3, 4]
 * unique([1, 2, 3, 4]); // [1, 2, 3, 4]
 * unique([NaN, null, undefined, '']); // [NaN, null, undefined, '']
 * unique([undefined, undefined, '']); // [undefined, '']
 * unique([NaN, NaN]); // [NaN]
 * unique([NaN, NaN], (a, b) => Number.isNaN(a) && Number.isNaN(b)); // [NaN]
 * const a = { value: 1 };
 * const b = { value: 2 };
 * const c = { value: 3 };
 * const d = { value: 2 };
 * unique([a, b, c, d]); // [a, b, c, d]
 * unique([]); // []
 * unique([a, b, c, d], (v1, v2) => v1.value === v2.value); // [a, b, c]
 *
 */
export function unique<T>(target: T[], isRepeatFn?: (value: T, value2: T) => boolean) {
  if (!target.length) return target;
  const fn = isRepeatFn || ((v1, v2) => v1 === v2 || (isNaN(v1) && isNaN(v2)));
  const result = [target[0] as T];
  for (let i = 1, len = target.length; i < len; i++) {
    const item = target[i] as T;
    if (result.some((resItem) => fn(resItem, item))) continue;
    result.push(item);
  }
  return result;
}

/**
 * 数组分片
 * @example
 * chunk([0,1,2,3,4,5,6], 3) // => [[0,1,2],[3,4,5],[6]]
 *
 * chunk([0, 1, 2, 3, 4, 5, 6], 10); // [[0, 1, 2, 3, 4, 5, 6]]
 * chunk([0, 1, 2, 3, 4, 5, 6], 1); // [[0], [1], [2], [3], [4], [5], [6]]
 * chunk([0, 1, 2, 3, 4, 5, 6], 0); // [0, 1, 2, 3, 4, 5, 6]
 * chunk([0, 1, 2, 3, 4, 5, 6], -1); // [0, 1, 2, 3, 4, 5, 6]
 * chunk([0, 1, 2, 3, 4, 5, 6], 3); // [[0, 1, 2], [3, 4, 5], [6]]
 * chunk([0, 1, 2, 3, 4, 5], 3); // [[0, 1, 2], [3, 4, 5]]
 * chunk([0, 1, 2, 3, 4], 3); // [[0, 1, 2], [3, 4]]
 * const emptyArr: any[] = [];
 * chunk(emptyArr, 3); // []
 * chunk(emptyArr, 3) !== emptyArr; // true
 * chunk({} as any, 3); // []
 *
 */
export function chunk(arr: unknown[], chunkLen: number) {
  if (chunkLen < 1) return arr.slice();
  const result: any[] = [];
  let i = 0;
  while (i < arr.length) {
    result.push(arr.slice(i, (i += chunkLen)));
  }
  return result;
}

/**
 * 判断min <= num <= max
 *
 * @example
 *
 * inRange(0, [undefined as any, 100]); // true
 * inRange(0, [0]); // true
 * inRange(0, [1]); // false
 * inRange(0, [1, 2]); // false
 *
 * @param value
 * @param [min = Number.MIN_SAFE_INTEGER]
 * @param [max = Number.MAX_SAFE_INTEGER]
 */
export function inRange(
  value: number,
  [min = -Infinity, max = Infinity]: [number?, number?],
): boolean {
  return min <= value && value <= max;
}

/**
 * inRange的复数版
 *
 * @see inRange
 *
 * @example
 *
 * inRanges(0, [undefined as any, 100]); // true
 * inRanges(0, [0]); // true
 * inRanges(0, [1]); // false
 * inRanges(0, [1, 2]); // false
 *
 * inRanges(0, [1, 2], [-9, -1]); // false
 * inRanges(-9, [1, 2], [-9, -1]); // true
 * inRanges(-1, [1, 2], [-9, -1]); // true
 * inRanges(-10, [1, 2], [-9, -1]); // false
 * inRanges(-10, [1, 2], [-9, -1], [-20, -10]); // true
 * inRanges(0, [1, 2], [-9, -1]); // false
 */
export function inRanges(value: number, ...ranges: [number?, number?][]): boolean {
  return ranges.some((item) => inRange(value, item));
}

/**
 * 数组分组
 * @example
 * groupBy([{type: 1}, {type: 2}], "type") // returns {1: [{type: 1}], 2: [{type: 2}]}
 * // 找不到对应key的分到'*'组
 * groupBy([{type: 1}, {value: 2}], "type") // returns {"*": [{value: 2}], 1: [{type: 1}]}
 *
 *
 * groupBy([{ type: 1 }, { type: 2 }], 'type'); // { 1: [{ type: 1 }], 2: [{ type: 2 }]}
 *
 * groupBy(
 * [
 *   { type: 1, value: 111 },
 *   { type: 2, value: 222 },
 *   { type: 1, value: 222 },
 *   { type: 2, value: 33344 },
 *   { type: 1, value: 333 },
 *   { type: 1, value: 444 },
 * ],
 * 'type'
 * );
 * // {
 * //  1: [
 * //    { type: 1, value: 111 },
 * //    { type: 1, value: 222 },
 * //    { type: 1, value: 333 },
 * //    { type: 1, value: 444 },
 * //  ],
 * //  2: [
 * //    { type: 2, value: 222 },
 * //    { type: 2, value: 33344 },
 * //  ],
 * // };
 *
 * groupBy([], ''); // {}
 * groupBy([], undefined as any); // {}
 * groupBy([{ type: 1 }, { type: 2 }], undefined as any); // { '*': [{ type: 1 }, { type: 2 }]}
 * groupBy([{ type: 1 }, { value: 2 }], 'type'); // { '*': [{ value: 2 }], 1: [{ type: 1 }] }
 *
 * // 默认 '*' 组 改为 'other' 组
 * groupBy([{ type: 1 }, { value: 2 }], 'type', 'other'); // {other: [{ value: 2 }],1: [{ type: 1 }] }
 *
 *
 * @param arr 数组
 * @param key 如果item中不存在该key，那么该item会归类到undefined
 * @param defaultKey 如果item中不存在该key，那么该item会归类到defaultKey
 */
export function groupBy<
  T extends { [k: string]: any },
  K extends keyof T,
  R extends { [k: string]: T[] },
>(arr: T[], key: K, defaultKey?: number | string): R;
/**
 * 数组分组
 *
 * @example
 *
 * groupBy(
 *   [
 *     { name: 'a', score: 50 },
 *     { name: 'b', score: 90 },
 *     { name: 'c', score: 70 },
 *     { name: 'd', score: 10 },
 *     { name: 'e', score: 100 },
 *   ],
 *   (item) => {
 *     const score = item.score;
 *     if (score >= 90) return 'A';
 *     if (score >= 60) return 'B';
 *     return 'C';
 *   },
 * );
 * // result
 * // {
 * //  A: [{ name: 'b', score: 90 }, { name: 'e', score: 100 }],
 * //  B: [{ name: 'c', score: 70 }],
 * //  C: [{ name: 'a', score: 50 }, { name: 'd', score: 10 }],
 * // }
 *
 * const list = [
 *   { code: 'a' },
 *   { code: 'a_a' },
 *   { code: 'a_b' },
 *   { code: 'a_c' },
 *   { code: 'b' },
 *   { code: 'b_a' },
 *   { code: 'b_b' },
 * ];
 *
 * const r = groupBy(list, (item, obj) => {
 *   let result = '';
 *   objForEach(
 *     obj,
 *     (_v, k): false | void => {
 *       if (new RegExp((k as string) + '_.+').test(item.code)) {
 *         result = k as string;
 *         return false;
 *       }
 *     },
 *     () => (result = item.code),
 *   );
 *   return result;
 * });
 *
 * r; // {a: [{ code: 'a' }, { code: 'a_a' }, { code: 'a_b' }, { code: 'a_c' }],b: [{ code: 'b' }, { code: 'b_a' }, { code: 'b_b' }]}
 *
 * @param arr 数组
 * @param by 归类回调
 * @param defaultKey 如果item中不存在该key，那么该item会归类到defaultKey
 */
export function groupBy<T extends { [k: string]: any }, R extends { [k: string]: T[] }>(
  arr: T[],
  by: (it: T, result: any) => string | void,
  defaultKey?: number | string,
): R;
export function groupBy(arr: any[], key: string | Function, defaultKey: number | string = '*') {
  const cb = isFunction(key) ? key : (item: Record<string, any>) => item[key];
  return arr.reduce((result, item) => {
    const k = cb(item, result) ?? defaultKey;
    if (!hasOwn(result, k)) {
      result[k] = [item];
    } else {
      result[k].push(item);
    }
    return result;
  }, {} as Record<string, any>);
}

/**
 * 查找是否items中任何一个在list中
 *
 * @example
 *
 * someInList([0, 20, 100], [...Array(10).keys()]); // true
 *
 * someInList([500, 20], Array.from({ length: 10 })); // false
 *
 * someInList([{ id: 1 }], [{ id: 1 }, { id: 2 }, { id2: 3 }]); // false
 *
 * const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
 * someInList([{ id: 1 }], list, (item, _i, list) => list.some((s) => s.id === item.id)),; // true
 *
 */
export function someInList<T>(
  items: T[],
  list: T[],
  cb: (item: T, index: number, list: T[]) => boolean = (v, _, arr) => arr.includes(v),
): boolean {
  return items.some((item, index) => {
    return cb(item, index, list);
  });
}

/**
 * 数组求和
 *
 * @example
 *
 * sum([0, 20, 100]); // 120
 * sum([-10, 20, 100]); // 110
 */
export function sum(arr: number[]): number {
  return arr.reduce((res, item) => item + res, 0);
}

/**
 * 数组求平均值
 *
 * @example
 *
 * avg([20, 20, 20]); // 20
 * avg([-10, 20, 20]); // 10
 *
 */
export function avg(arr: number[]): number {
  return sum(arr) / arr.length;
}
