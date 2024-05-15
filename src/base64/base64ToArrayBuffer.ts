import { parseBase64 } from './parseBase64';

/**
 * 把 base64 转成 ArrayBuffer
 *
 * 可与 arrayBufferToBase64 互相转换
 *
 * @see arrayBufferToBase64
 * @see parseBase64
 *
 * @example
 * const base64 = 'data:application/json;base64,ewogICJoZWxsbyI6ICJ3b3JsZCIKfQ==';
 * const buffer = base64ToArrayBuffer(base64);
 * arrayBufferToBase64(buffer); // base64.split(',')[1]
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  return parseBase64(base64).uint8Array.buffer;
}
