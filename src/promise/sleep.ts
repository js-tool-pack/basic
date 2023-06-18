/**
 * 等待一段时间后再执行后面的代码
 *
 * @example
 * // 等待100毫秒
 * await sleep(100);
 * /* do something *\/
 *
 * @param ms 等待时间，单位毫秒
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
