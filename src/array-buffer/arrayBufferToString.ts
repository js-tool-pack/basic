/**
 * 把 ArrayBuffer 编码为 string
 *
 * @see stringToArrayBuffer
 */
export function arrayBufferToString(ab: ArrayBuffer): string {
  const u16a = new Uint16Array(ab);
  const len = u16a.length;
  let result = '';
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(u16a[i]!);
  }
  return result;
}
