import { hasOwn } from '../../object';
import { isFunction } from '../../data-type';

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
  T extends {
    [k: string]: any;
  },
  K extends keyof T,
  R extends {
    [k: string]: T[];
  },
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
export function groupBy<
  T extends {
    [k: string]: any;
  },
  R extends {
    [k: string]: T[];
  },
>(arr: T[], by: (it: T, result: any) => string | void, defaultKey?: number | string): R;
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
