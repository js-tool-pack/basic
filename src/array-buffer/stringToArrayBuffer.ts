/**
 * string 编码转换为 ArrayBuffer
 *
 * @see arrayBufferToString
 */
export function stringToArrayBuffer(value: string): ArrayBuffer {
  const len = value.length;
  const result = new Uint16Array(value.length);
  for (let i = 0; i < len; i++) {
    result[i] = value.charCodeAt(i);
  }
  return result.buffer;
}
