/**
 * 不使用setTimeout，使用promise实现的debounce
 *
 * 前一个promise未完成即reject，最后一个或者中断前调用的才会执行
 * 无法阻止cb被调用 不推荐使用
 *
 * 只有debounceByPromise(()=>{})().then的.then是防抖的，回调不防抖
 *
 * @example
 *
 * const dbFn = debounceByPromise((time = 50) => {
 *   const p = new Promise<number>((resolve) => {
 *     setTimeout(() => {
 *       resolve(time);
 *     }, time);
 *   });
 *   p.then(() => {
 *     times++;
 *   });
 *   return p;
 * });
 *
 * const res = await Promise.any([dbFn(40), dbFn(20), dbFn(60), dbFn(30)]);
 * res; // 30
 *
 *
 */
export function debounceByPromise<T, CB extends (...args: any[]) => Promise<T>>(callback: CB): CB {
  let rejectFn: Function;
  return function (this: any, ...args: any[]): Promise<T> {
    rejectFn && rejectFn();

    return new Promise(async (res, rej) => {
      rejectFn = rej;
      const result = await callback.apply(this, args);
      res(result);
    });
  } as CB;
}
