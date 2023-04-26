import { createTimeCountDown } from '../time';
import { debounce } from './debounce';

/**
 * 节流函数
 * ---
 * 节流除非是开启了尾调用否则是立即执行的，也就不需要防抖的cancel与flush
 *
 * @example
 *
 * // ----------- 基础用法 -----------
 * let count = 0;
 * let elseCount = 0;
 * let res = '';
 * const wrapFn = throttle((_res: string) => (count++, (res = _res)), 10, {
 *   invalidCB() {
 *     elseCount++;
 *   },
 * });
 *
 * wrapFn('0');
 * wrapFn('1');
 * wrapFn('2');
 *
 * res; // '0'
 * elseCount; // 2
 *
 * // ----------- 首调用 -----------
 * let times = 0;
 *
 * let wrapFn = throttle(() => times++, 100, { leading: false });
 * // 初始时时0次
 * times; // 0
 * // 执行一次
 * wrapFn();
 * // 由于节流包裹函数时就开启了节流，此时还在时间内，所以内部不执行
 * times; // 0
 * await sleep(120);
 * // 上一次执行的被丢弃了
 * times; // 0
 * // 在间隔期外执行
 * wrapFn();
 * // 此时成功执行
 * times; // 1
 *
 * times = 0;
 * // 立即执行
 * wrapFn = throttle(fn, 100, { leading: true });
 * times; // 0
 * wrapFn();
 * // 由于节流包裹时未开启计时，所以
 * times; // 1
 *
 * // ----------- 尾调用 -----------
 *
 * let times = 0;
 * const wrapFn = throttle(() => times++, 100, { leading: false, trailing: true });
 * // 初始时时0次
 * times; // 0
 * // 执行一次
 * wrapFn();
 * wrapFn();
 * wrapFn();
 * // 由于节流包裹函数时就开启了节流，此时还在时间内，所以内部不执行
 * times; // 0
 * await sleep(120);
 * // 上一次执行的不会被丢弃
 * times; // 1
 *
 *
 * @param callback 需要被节流函数包裹的函数
 * @param interval 间隔时间
 * @param options
 * @param [options.leading=true] 首调用；未开启时是有个初始倒计时的，为true时关闭初始倒计时，默认true
 * @param [options.trailing=false] 尾调用
 * @param options.invalidCB 间隔期间调用throttle返回的函数执行的回调  例如一个按钮5秒点击一次，不可点击时执行该函数
 */
export function throttle<CB extends (...args: unknown[]) => void | any>(
  callback: CB,
  interval: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    invalidCB?: (timeCountDown: number) => void;
  } = {},
): CB {
  const _options: Required<Parameters<typeof throttle>[2]> = {
    invalidCB: () => void 0,
    trailing: false,
    leading: true,
    ...options,
  };
  let getCountDown = _options.leading ? () => 0 : createTimeCountDown(interval);
  const db = _options.trailing ? debounce(callback, interval) : null;
  return function (this: unknown, ...args: unknown[]) {
    const countDown = getCountDown();
    if (countDown > 0) {
      _options.invalidCB(countDown);
      db?.apply(this, args);
      return;
    }
    db?.cancel();
    getCountDown = createTimeCountDown(interval);
    return callback.apply(this, args);
  } as CB;
}

// 第1种实现方式
/*export function throttle<CB extends (...args: any[]) => (void | any)>(
    callback: CB,
    delay: number,
    invalidCB?: (interval: number) => void,
): CB {
    let lastTime = 0;
    return function (...args: any[]) {
        const now = Date.now();
        const interval = now - lastTime;
        if (interval < delay) {
            invalidCB && invalidCB(delay - interval);
            return;
        }
        lastTime = now;
        return callback.apply(this, args);
    } as CB;
}*/

// 第三种实现方式，不能获取剩余时间或者另外获取时间，有点多余
/*export function throttleByTimeOut<CB extends (...args: any[]) => (void | any)>(
    callback: CB,
    delay: number,
    invalidCB?: (interval: number) => void,
): CB {
    let throttling = false;
    return function (...args: any[]) {
        if (throttling) {
            return;
        }
        throttling = true;
        setTimeout(() => {
            throttling = false;
        }, delay);
        return callback.apply(this, args);
    } as CB;
}*/
