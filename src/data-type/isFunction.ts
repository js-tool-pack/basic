import { typeOf } from './typeOf';

/**
 * 判断目标是否是函数
 *
 * 判定方式：typeOf(target) === 'function'
 *
 * @example
 * isFunction(''); // false
 * isFunction(() => {}); // true
 * isFunction(function () {}); // true
 */
export function isFunction<T extends Function = Function>(target: unknown): target is T {
  return typeOf(target) === 'function';
}
