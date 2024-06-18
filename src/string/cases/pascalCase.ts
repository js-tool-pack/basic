import { splitByCases } from './splitByCases';
import { capitalize } from '../capitalize';

/**
 * 其他变量命名风格转大驼峰
 *
 * @example
 *
 * pascalCase('helloWorld'); // 'HelloWorld'
 * pascalCase('hello-World'); // 'HelloWorld'
 * pascalCase('hello world'); // 'HelloWorld'
 * pascalCase('Hello   world'); // 'HelloWorld'
 * pascalCase('Hello___world'); // 'HelloWorld'
 *
 */
export function pascalCase(value: string): string {
  if (!value) return value;
  return splitByCases(value)
    .map((w) => capitalize(w))
    .join('');
}
