import type { StrTemplate } from '@tool-pack/types';

/**
 * 模仿c语言的模板字符串
 *
 * 目前只支持%s,给不能用``模板字符串的环境使用，像一些es5环境也可以用来事先准备好模板用于替换
 *
 * @overload 都是字符串的话ts提示会直接拼接好字符串
 *
 * @example
 *
 * strTemplate('1%s3', '2'); // '123'
 * strTemplate('hell%s worl%s', 'o', 'd'); // 'hello world'
 * strTemplate('hell%s worl%s'); // 'hell worl'
 *
 */
export function strTemplate<T extends string, S extends string[]>(
  str: T,
  ...params: S
): StrTemplate<T, S>;
/**
 * 模仿c语言的模板字符串
 *
 * 目前只支持%s,给不能用``模板字符串的环境使用，像一些es5环境也可以用来事先准备好模板用于替换
 *
 * @overload 这样的ts提示不准确，%s会变为类型而不是字面值
 *
 * @example
 *
 * ```ts
 * strTemplate('1%s%s86', 0, '0') // return: 10086;  // type alias: `1${number}${string}86`
 * ```
 *
 */
export function strTemplate<T extends string, S extends any[]>(
  str: T,
  ...params: S
): StrTemplate<T, S>;
export function strTemplate(str: string, ...params: any[]) {
  /*
    // es5; typescript不需要str, ...params参数`
    var args = Array.prototype.slice.call(arguments, 0);
    if (!args.length) return "";
    var str = args[0];
    var params = args.slice(1);
    */
  return str.replace(/%s/g, () => (params.length ? params.shift() : ''));
}
