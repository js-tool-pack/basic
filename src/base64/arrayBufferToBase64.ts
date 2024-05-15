import { arrayBufferToString } from '../array-buffer';

/**
 * 把 ArrayBuffer 转成 base64
 *
 * 可与 base64ToArrayBuffer 互相转换
 *
 * @see base64ToArrayBuffer
 *
 * @example
 * const str = JSON.stringify({ hello: 'world' }, null, 2);
 * const buffer = stringToArrayBuffer(str, 8);
 * arrayBufferToBase64(buffer); // 'ewogICJoZWxsbyI6ICJ3b3JsZCIKfQ=='
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  // return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return btoa(arrayBufferToString(buffer, 8));
}
