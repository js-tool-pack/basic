import { typeOf } from './typeOf';

/**
 * 用typeIn("123", ["string", "number"]) 代替  typeOf("123") === "string" || typeOf("123") === "number"
 *
 * 注意： 只能判断typeOf能够判断的类型   不能判断是否是NaN 是否是""
 *
 * 判定方式：types.indexOf(typeOf(target)) > -1
 *
 * @example
 * inTypes(0, ['string', 'number']); // true
 * inTypes(0, ['string', 'function', 'object']); // false
 */
export function inTypes(target: unknown, types: string[]): boolean {
  return types.indexOf(typeOf(target)) > -1;
}
