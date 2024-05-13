/**
 * 把 ArrayBuffer 编码为 string
 *
 * @see stringToArrayBuffer
 */
export function arrayBufferToString(ab: ArrayBuffer): string {
  const u8a = new Uint8Array(ab);
  const len = u8a.byteLength;
  let result = '';
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(u8a[i]!);
  }
  return result;
}
