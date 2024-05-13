import { arrayBufferToString } from './arrayBufferToString';

/**
 * 将被 encodeObjectToArrayBuffer 转成 ArrayBuffer 的 object 还原回来
 *
 * @see encodeObjectToArrayBuffer
 */
export function decodeArrayBufferToObject<T>(buffer: ArrayBuffer): T | null {
  // TextEncoder 在 node 环境下不支持
  // const u8a = new Uint8Array(buffer);
  // const str = new TextDecoder().decode(u8a);

  const str = arrayBufferToString(buffer);
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
