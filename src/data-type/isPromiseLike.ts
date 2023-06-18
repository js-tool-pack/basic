/**
 * 判断目标是否是promise like
 *
 * 参考is-promise
 *
 * @example
 *
 * isPromiseLike({}); // false
 * isPromiseLike(Promise.resolve()); // true
 * isPromiseLike(null); // false
 * isPromiseLike(null); // false
 * isPromiseLike(undefined); // false
 * isPromiseLike(0); // false
 * isPromiseLike(-42); // false
 * isPromiseLike(42); // false
 * isPromiseLike(''); // false
 * isPromiseLike('then'); // false
 * isPromiseLike(false); // false
 * isPromiseLike(true); // false
 * isPromiseLike({}); // false
 * isPromiseLike({ then: true }); // false
 * isPromiseLike([]); // false
 * isPromiseLike([true]); // false
 * isPromiseLike(() => {}); // false
 *
 * const promise = {
 *   then: () => {},
 * };
 * isPromiseLike(promise); // true
 * const fn = () => {};
 * fn.then = () => {};
 * isPromiseLike(fn); // true
 */
export function isPromiseLike<T, S>(target: PromiseLike<T> | S): target is PromiseLike<T> {
  const type = typeof target;
  return (
    !!target /*null也是object*/ &&
    (type === 'object' || type === 'function') &&
    typeof (target as any).then === 'function'
  );
}
