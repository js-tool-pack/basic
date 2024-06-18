import type { InsertToArrayToCBOptions } from './types';
import { findIndexRight } from './findIndexRight';
import { isFunction } from '../../data-type';
import { castArray } from './castArray';
import { findIndex } from './findIndex';

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
     * 从前还是从后查起，true为前
     */
    reverse?: boolean;
    /**
     * 插入位置前后，true为后
     */
    after?: boolean;
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
     * 从前还是从后查起，true为前
     */
    reverse?: boolean;
    /**
     * 插入位置前后，true为后
     */
    after?: boolean;
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
  to: Function | number,
  array: unknown[],
  { reverse = false, after = false } = {},
): number {
  const inserts = castArray(insert) as unknown[];
  let index = to as number;
  if (isFunction(to)) {
    index = (reverse ? findIndexRight : findIndex)(array, (v, k, a) => {
      const _options = {
        index: k,
        array: a,
        item: v,
      };
      const options = Array.isArray(insert)
        ? ({
            ..._options,
            inserts: insert as any[],
          } as Omit<InsertToArrayToCBOptions, 'insert'>)
        : ({
            ..._options,
            insert,
          } as Omit<InsertToArrayToCBOptions, 'inserts'>);
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
