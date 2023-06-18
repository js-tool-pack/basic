import { reduceObj } from '../iterate';

/**
 * Omit 类似TS的Omit类型
 * @example
 *
 * omit({ a: 12, b: true, c: 'c' }, ['a']); // { b: true, c: 'c' }
 * omit({ a: 12, b: true, c: 'c' }, ['a', 'b']); // { c: 'c' }
 * omit({ c: 'c' }, ['c']); // {}
 */
export function omit<T extends object, K extends keyof T>(
  target: T,
  keys: readonly K[],
): Omit<T, K> {
  const newKeys = keys.slice();
  return reduceObj(
    target,
    (initValue, v, k) => {
      const index = newKeys.indexOf(k as K);
      if (index === -1) {
        initValue[k] = v;
      } else {
        newKeys.splice(index, 1);
      }
      return initValue;
    },
    {} as any,
  );
}
