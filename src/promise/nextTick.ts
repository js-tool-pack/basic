/**
 * 使用promise实现的nextTick
 *
 * @override ## 返回Promise
 *
 * @example
 *
 * nextTick().then(() => {
 *   // do something
 * });
 *
 * // or
 *
 * await nextTick();
 * // do something
 */
export function nextTick(): Promise<void>;
/**
 * 使用promise实现的nextTick
 *
 * @override ## 传入回调，返回中断闭包函数
 *
 * @example
 *
 * nextTick(() => {
 *   // do something
 * });
 */
export function nextTick(then: () => unknown): () => void;
export function nextTick(then?: () => unknown): (() => void) | Promise<void> {
  const p = Promise.resolve();
  if (!then) return p;

  let aborted = false;
  p.then(() => !aborted && then());
  return () => {
    aborted = true;
  };
}
