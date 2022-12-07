import { debounce, polling, throttle } from './common';
import type { OmitFirstParameters } from '@tool-pack/types';

/**
 * 把一个函数转变为装饰器
 *
 * @see Debounce
 * @see Polling
 *
 * @example
 *
 * // 防抖装饰器
 * const Debounce = (...args: OmitFirstParameters<typeof debounce>) => decoratorfy((descriptor) => debounce(descriptor.value, ...args));
 *
 */
export function decoratorfy(callback: (descriptor: PropertyDescriptor, target: any) => Function) {
  return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    // 在babel的网站编译的是target包含key，descriptor
    if (target.descriptor) {
      descriptor = target.descriptor;
    }
    descriptor.value = callback(descriptor, target);
  };
}

/**
 * 防抖装饰器
 *
 * @constructor
 *
 * @see debounce
 *
 * @example
 *
 * class Test {
 *   times = 0;
 *   time = 0;
 *   value: string | number = '';
 *
 *   @Debounce(1000)
 *   test(value: string | number) {
 *     this.times++;
 *     this.time = Date.now();
 *     this.value = value;
 *   }
 * }
 *
 * const t = new Test();
 *
 * t.test(1);
 * t.test(2);
 * t.test(3);
 * t.test(4);
 *
 */
export const Debounce = (...args: OmitFirstParameters<typeof debounce>) =>
  decoratorfy((descriptor) => debounce(descriptor.value, ...args));

/**
 * 节流装饰器
 *
 * @constructor
 *
 * @see throttle
 *
 * @example
 *
 * class Test {
 *   times = 0;
 *   time = 0;
 *   value: string | number = '';
 *
 *   @Throttle(100)
 *   test(value: string | number) {
 *     this.times++;
 *     this.time = Date.now();
 *     this.value = value;
 *   }
 * }
 *
 * const t = new Test();
 *
 * t.test(1);
 * t.test(2);
 * t.test(3);
 * t.test(4);
 *
 */
export const Throttle = (...args: OmitFirstParameters<typeof throttle>) =>
  decoratorfy((descriptor) => throttle(descriptor.value, ...args));
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

/*
export function Singleton<T extends { new(...args: any[]): {} }>(constructor: T): any {
    class newClass extends constructor {
        private static instance?: newClass;

        private constructor(...args: any[]) {
            super(...args);
        }

        public static get Ins(): newClass {
            if (!newClass.instance) {
                newClass.instance = new newClass();
            }
            return newClass.instance;
        }

    }

    return newClass;
}
*/
