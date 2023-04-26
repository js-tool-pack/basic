/**
 * 防抖函数
 * ---
 * **规则**
 * - 如果是多次执行 debounce 函数，在 debounce 生效期间会返回上一次执行的结果
 * - 开启了 leading 首调用，那么 debounce 生效一次，会执行两次
 * - 手动取消成功时，下一次 leading 一定可以执行
 * - 手动 flush 时，取消定时器，也就是取消当前的尾调用
 * - 如果手动 flush 最近一次调用 debounce 时已经成功执行过了，那么直接返回上一次的结果
 *    > 例子：在 debounce 已经停止了，leading 已经重新可以执行的期间，去手动调用 flush，此时直接返回上一次的执行结果
 *
 * @example
 *
 * let times = 0;
 * const wrapFn = debounce(() => times++, 100);
 * wrapFn();
 * times; // 0
 * // 立即执行上一次的防抖函数
 * wrapFn.flush();
 * times; // 1
 * wrapFn();
 * // 取消上一次的防抖
 * wrapFn.cancel();
 * await sleep(110);
 * times; // 1
 *
 * @param callback 回调
 * @param delay 延时
 * @param [leading = false] 首调用；debounce本是尾调用，开启了首调用后，除非手动取消否则调用后最少执行两次，也就是会执行首尾调用各一次
 *
 * @returns 返回一个函数，并给该函数添加cancel取消执行和flush立即执行两个子函数
 */
export function debounce<CB extends (...args: any[]) => any>(
  callback: CB,
  delay: number,
  leading = false,
): CB & {
  cancel(): void;
  flush(): ReturnType<CB>;
} {
  let lastThis: unknown;
  let lastArgs: any;
  let lastResult: unknown;
  let timer: ReturnType<typeof setTimeout> | void;
  let canLeadingRun = true;
  const cancel = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = undefined;
  };
  const flush = () => {
    lastResult = callback.apply(lastThis, lastArgs);
    lastArgs = undefined;
    return lastResult;
  };
  const _debounce = function (this: unknown, ...args: unknown[]) {
    cancel();
    lastThis = this;
    lastArgs = args;
    if (canLeadingRun && leading) {
      flush();
      canLeadingRun = false;
    }
    timer = setTimeout(() => {
      flush();
      canLeadingRun = true;
      timer = undefined;
    }, delay);
    return lastResult;
  } as ReturnType<typeof debounce>;
  _debounce.cancel = () => {
    cancel();
    // 手动取消成功时，下一次 leading 一定可以执行
    canLeadingRun = true;
  };
  _debounce.flush = () => {
    const _timer = timer;
    // 手动 flush 时，取消定时器，也就是取消尾调用
    _debounce.cancel();
    // 如果手动 flush 最近一次调用 debounce 时已经 flush 过了，那么直接返回上一次的结果
    if (!_timer) return lastResult;
    return flush();
  };
  return _debounce as any;
}
