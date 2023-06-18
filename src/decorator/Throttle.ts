import type { OmitFirstParameters } from '@tool-pack/types';
import { decoratorfy } from './decoratorfy';
import { throttle } from '../common';

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
