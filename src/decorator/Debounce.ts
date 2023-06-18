import type { OmitFirstParameters } from '@tool-pack/types';
import { decoratorfy } from './decoratorfy';
import { debounce } from '../common';

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
