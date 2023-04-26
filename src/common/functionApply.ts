import { generateFunctionCode } from './generateFunctionCode';

/**
 * 模拟Function.prototype.apply函数代替扩展运算符，使用数组传值给不定参数的函数传参
 *
 * 案例
 * const args = [1, 2, 3];
 * (new Function(generateFunctionCode(args.length)))(object, property, args);
 *
 * @example
 *
 * '123'.padStart(6, '0'); // '000123'
 * const value = functionApply(
 *   { strPadStart: (s: string, count: number, pad: string) => s.padStart(count, pad) },
 *   'strPadStart',
 *   ['123', 6, '0'],
 * );
 * value; // '000123'
 *
 */
export function functionApply<T extends object, K extends keyof T>(
  obj: T,
  property: K,
  args: any[],
) {
  return new Function(generateFunctionCode(args.length))(obj, property, args);
}
