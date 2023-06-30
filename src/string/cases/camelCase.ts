import { capitalize } from '../capitalize';
import { CaseSplitRegExp } from './regexp';

/**
 * 其他变量命名风格转小驼峰
 *
 * @example
 *
 * camelCase('HELLO-WORLD'); // 'helloWorld'
 * camelCase('hello-World'); // 'helloWorld'
 * camelCase('hello world'); // 'helloWorld'
 * camelCase('Hello   world'); // 'helloWorld'
 * camelCase('Hello___world'); // 'helloWorld'
 *
 */
export function camelCase(value: string): string {
  if (!value) return value;
  const [first, ...rest] = value.split(CaseSplitRegExp).filter(Boolean);
  return (first as string).toLowerCase() + rest.map(capitalize).join('');
}
