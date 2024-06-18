/**
 * 把 ArrayBuffer 编码为 string
 *
 * @see stringToArrayBuffer
 */
export function arrayBufferToString(ab: ArrayBuffer, uint: 16 | 8 = 16): string {
  const ua = new (uint === 16 ? Uint16Array : Uint8Array)(ab);
  const len = ua.length;
  let result = '';
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(ua[i]!);
  }
  return result;
}
