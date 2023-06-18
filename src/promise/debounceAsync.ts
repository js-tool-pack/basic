/**
 * 回调支持promise的debounce
 *
 * 如果callback执行了的话，那么不论是否resolved都不会再被reject
 *
 * @example
 *
 * let times = 0;
 *
 * const dbFn = debounceAsync(() => {
 *   return new Promise((resolve) => {
 *     resolve(times++);
 *   });
 * }, 100);
 *
 * await Promise.allSettled([dbFn(), dbFn(), dbFn(), dbFn()]);
 *
 * times; // 1
 *
 */
export function debounceAsync<T, CB extends (...args: any[]) => Promise<T>>(
  callback: CB,
  delay: number,
): CB {
  let timer: any = null;
  let rej: Function;
  return function (this: any, ...args: any[]) {
    return new Promise<T>((resolve, reject) => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
        rej('debounceAsync reject');
      }
      rej = reject;
      timer = setTimeout(async () => {
        timer = null;
        const result = await callback.apply(this, args);
        resolve(result);
      }, delay);
    });
  } as CB;
}
