import { isPromiseLike } from '../data-type';

/**
 * 只在非loading下执行回调
 *
 * 例如在滚动事件下执行请求，请求完成前不会再次执行
 *
 * @example
 *
 * ```typescript
 *
 * const fn = jest.fn();
 * const cb2 = loadingElse(() => sleep(10).then(fn));
 * cb2();
 * cb2();
 * cb2();
 * cb2();
 * cb2();
 *
 * await sleep(20);
 * expect(fn.mock.calls.length).toBe(1);
 * ```
 *
 * @param cb
 */
export function loadingElse<T extends (...args: unknown[]) => unknown>(cb: T): T {
  let loading = false;
  const setLoadingFalse = () => (loading = false);
  let result: unknown;
  return ((...args) => {
    if (loading) return result;
    loading = true;

    result = cb(...args);
    if (isPromiseLike(result)) {
      result.then(setLoadingFalse, setLoadingFalse);
    } else setLoadingFalse();
    return result;
  }) as T;
}
