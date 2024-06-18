import { pickDiff } from './pickDiff';
import { hasOwn } from '../common';

/**
 * 从其他对象中挑出与原对象中不存在的键值对所组成的新对象
 *
 * @overload 返回值支持ts类型推导
 *
 * @example
 *
 * pickExternal({ a: 1 }, { a: 2 }); // {}
 * pickExternal({ a: 1 }, { b: 2 }); // { b: 2 }
 * pickExternal({ a: 1 }, { b: 2, c: 3 }); // { b: 2, c: 3 }
 * pickExternal({ a: 1, b: 2 }, { b: 2, c: 3 }); // { c: 3 }
 *
 */
export function pickExternal<T extends object, K extends object>(
  origin: T,
  other: K,
): Omit<K, keyof T>;
/**
 * 从其他对象中挑出与原对象中不存在的键值对所组成的新对象
 *
 * @overload 返回值不支持ts类型推导, 返回的对象类型始终是 Record<string, any>
 *
 * pickExternal({ a: 1, b: 2 }, { b: 2, c: 3 }, { b: 2, c: 3 }); // { c: 3 }
 */
export function pickExternal(origin: object, ...others: object[]): Record<string, any>;
export function pickExternal(origin: object, ...others: object[]) {
  return pickDiff(origin, others, (_originV, _objV, k) => hasOwn(origin, k));
}
