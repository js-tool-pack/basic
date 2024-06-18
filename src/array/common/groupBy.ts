import { isFunction } from '../../data-type';

/**
 * 数组分组
 *
 * 注意：该重载默认查找 item 对象的 key 而不是 item
 *
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
 * @param key 如果 item 中不存在该 key，那么该 item 会归类到 defaultKey
 * @param [defaultKey='*'] 所有未归类的 item 都会归类到 defaultKey
 */
export function groupBy<
  const T extends Record<string, any>,
  K extends keyof T,
  D extends string = '*',
>(arr: ArrayLike<T>, key: K, defaultKey?: D): Partial<Record<T[K] | D, T[]>>;

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
 * groupBy([50, 90, 70, 10, 100], (score) => {
 *   if (score >= 90) return 'A';
 *   if (score >= 60) return 'B';
 *   return 'C';
 * });  // {A:[90, 100], B:[70], C:[50, 10]};
 * // 约等于
 * groupBy(
 *   [50, 90, 70, 10, 100],
 *   (score): string | void => {
 *     if (score >= 90) return 'A';
 *     if (score >= 60) return 'B';
 *   },
 *   'C',
 * ),;  // {A:[90, 100], B:[70], C:[50, 10]};
 *
 * @param arr 数组
 * @param by 归类回调；如果返回值为空则会归类到 defaultKey
 * @param [defaultKey='*'] 所有未归类的 item 都会归类到 defaultKey
 */
export function groupBy<
  T,
  B extends (it: T, result: Partial<Record<string, T[]>>) => string | void,
  D extends string = '*',
>(arr: ArrayLike<T>, by: B, defaultKey?: D): Partial<Record<Exclude<ReturnType<B>, void> | D, T[]>>;

export function groupBy(
  arr: ArrayLike<unknown>,
  key: Function | string,
  defaultKey: number | string = '*',
): Record<string, unknown[]> {
  const getItemKey = isFunction(key) ? key : (item: Record<string, any>) => item[key];
  const result: Record<string, unknown[]> = {};

  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i];
    const k = getItemKey(item, result) ?? defaultKey;
    const v = result[k];
    if (v) v.push(item);
    else result[k] = [item];
  }

  return result;
}
