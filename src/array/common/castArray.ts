import { isArray } from '../../data-type';

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
