import type { ToCamelCase } from '@tool-pack/types';
import { capitalize } from './capitalize';

/**
 * 其他转驼峰
 *
 * @example
 *
 * expect(toCamel('A')).toBe('a');
 * // 转大驼峰
 * toCamel('A', undefined, true); // 'A'
 *
 * toCamel('a'); // 'a'
 * // 转大驼峰
 * toCamel('a', undefined, true); // 'A'
 *
 * toCamel('1'); // '1'
 *
 * toCamel('ab'); // 'ab'
 * // 转大驼峰
 * toCamel('ab', undefined, true); // 'Ab'
 *
 * // 默认选项
 * toCamel('aa_bb'); // 'aaBb'
 * toCamel('test_camel_string'); // 'testCamelString'
 * toCamel('test__camel_string'); // 'testCamelString'
 *
 * // 默认分隔符，转大驼峰
 * toCamel('test_camel_string', undefined, true); // 'TestCamelString'
 *
 * // 正则匹配分隔符
 * toCamel('test-camel_string', /[-_]/); // 'testCamelString'
 *
 * // edge
 * toCamel('', ''); // ''
 *
 * @param {string} value
 * @param {string | RegExp} delimiter
 * @param {boolean} toUpperCamelCase
 */
export function toCamel<
  S extends string,
  D extends string | RegExp = '_',
  U extends boolean = false,
>(
  value: S,
  delimiter: D = '_' as D,
  toUpperCamelCase: U = false as U,
): D extends string
  ? U extends true
    ? Capitalize<ToCamelCase<S, D>>
    : ToCamelCase<S, D>
  : string {
  if (!value.length) return value as any;
  const reg = typeof delimiter === 'string' ? new RegExp(delimiter + '+') : (delimiter as RegExp);
  const join = value.split(reg).map((i) => capitalize(i) as string);
  if (!toUpperCamelCase && join.length) {
    join[0] = (join[0] as string).toLowerCase();
  }
  return join.join('') as any;
}
