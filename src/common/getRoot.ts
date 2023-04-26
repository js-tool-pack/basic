/**
 * 获取全局对象
 *
 * @example
 *
 * // browser
 * getRoot(); // window
 *
 * // nodejs
 * getRoot(); // global
 *
 */
export function getRoot() {
  try {
    // 像electron会禁用这种方法
    return Function('return this')();
  } catch (e) {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof self !== 'undefined') return self;
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;
  }
}
