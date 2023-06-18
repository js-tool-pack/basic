import { isBroadlyObj } from './isBroadlyObj';

/**
 * 判断是否内置方法
 *
 * @example
 * isNative(Array.prototype.forEach); // true
 * isNative(Array.prototype.map); // true
 * const map = Array.prototype.map;
 * isNative(map); // true
 * isNative(() => {}); // false
 * isNative(Object.assign); // true
 * isNative(Object); // true
 * isNative(Boolean); // true
 * isNative(window.isNaN); // true
 * isNative(isNaN); // false
 */
export function isNative(value: unknown): boolean {
  const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  const reIsNative = RegExp(
    `^${Function.prototype.toString
      .call(Object.prototype.hasOwnProperty)
      .replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\])/g, '$1.*?')}$`,
  );
  return isBroadlyObj(value) && reIsNative.test(value as any);
}
