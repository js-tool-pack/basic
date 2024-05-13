/**
 * string 编码转换为 ArrayBuffer
 *
 * @see arrayBufferToString
 */
export function stringToArrayBuffer(value: string): ArrayBuffer {
  const len = value.length;
  const result = new Uint8Array(value.length);
  for (let i = 0; i < len; i++) {
    result[i] = value.charCodeAt(i) & 0xff;
  }
  return result.buffer;
}
