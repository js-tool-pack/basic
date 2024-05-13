import { stringToArrayBuffer } from './stringToArrayBuffer';

/**
 * 把 object 编码为 ArrayBuffer
 *
 * 注意：如果 对象里面有特殊对象，例如 函数、正则、ArrayBuffer 等， 那么会被 JSON.stringify 转成空，需要自行转换，如果是 ArrayBuffer 可先 使用 arrayBufferToString 转换为 string
 *
 * @see decodeArrayBufferToObject
 * @see encodeArrayBufferToString
 */
export function encodeObjectToArrayBuffer(obj: object): ArrayBuffer {
  const str = JSON.stringify(obj);
  // TextEncoder 在 node 环境下不支持
  // const u8a = new TextEncoder().encode(str);
  // return u8a.buffer;
  return stringToArrayBuffer(str);
}
