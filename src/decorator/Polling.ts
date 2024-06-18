import type { OmitFirstParameters } from '@tool-pack/types';
import { decoratorfy } from './decoratorfy';
import { polling } from '../common';

// Throttle(1, () => 0);
/**
 * 比setInterval好的地方在于使用promise判断一回执行完毕情况
 * @param interval
 * @param [immediate=true]
 * @constructor
 */
/*export function Polling(interval: number, immediate = true) {
    enum state {running, stopped}

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // 在babel的网站编译的是target包含key，descriptor
        if (target.descriptor) {
            descriptor = target.descriptor;
        }

        const origin = descriptor.value;

        function start() {
            return new Promise<void>((res, rej) => {
                let timer: any;
                let status: state;
                let times = 0;

                function nextTimeout() {
                    timer = setTimeout(handle, interval);
                }

                function clear() {
                    status = state.stopped;
                    clearTimeout(timer);
                    res();
                }

                function handle() {
                    const back = origin.call(this, times++, res, rej);
                    if (status === state.running) {
                        if (back instanceof Promise) {
                            (back as Promise<any>).then(function () {
                                nextTimeout();
                            }).catch(clear);
                        } else {
                            back === false ? clear() : nextTimeout();
                        }
                    }
                }

                status = state.running;
                if (immediate) {
                    handle();
                } else {
                    nextTimeout();
                }
            });
        }

        descriptor.value = start;
    };

}*/

/**
 * 轮询装饰器
 *
 * @constructor
 *
 * @see polling
 *
 * @example
 *
 * class Test {
 *   times = 0;
 *
 *   @Polling(10, true)
 *   test(times?: number) {
 *     this.times = times as number;
 *     if ((times as number) >= 5) {
 *       return Promise.reject();
 *     } else {
 *       // console.log(times);
 *       return Promise.resolve();
 *     }
 *   }
 * }
 *
 * const t = new Test();
 *
 * await t.test();
 *
 * t.times; // 5
 */
export const Polling = (...args: OmitFirstParameters<typeof polling>) =>
  decoratorfy((descriptor) => {
    const origin = descriptor.value;
    function handle(this: any) {
      const p = polling(origin.bind(this), ...args);
      (handle as any).cancel = p.cancel;
      return p.promise;
    }
    return handle;
  });
