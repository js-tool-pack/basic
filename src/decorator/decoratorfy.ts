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
