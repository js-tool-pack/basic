/**
 * string 编码转换为 ArrayBuffer
 *
 * @see arrayBufferToString
 */
export function stringToArrayBuffer(value: string, uint: 16 | 8 = 16): ArrayBuffer {
  const len = value.length;
  const result = new (uint === 16 ? Uint16Array : Uint8Array)(value.length);
  for (let i = 0; i < len; i++) {
    result[i] = value.charCodeAt(i);
  }
  return result.buffer;
}
