/**
 * 判断目标是否可迭代
 *
 * @example
 *
 * isIterable(null); // false
 * isIterable(undefined); // false
 * isIterable(0); // false
 * isIterable(true); // false
 * isIterable({}); // false
 * isIterable(Symbol('123')); // false
 * isIterable(''); // true
 * isIterable([]); // true
 * isIterable([0, 1]); // true
 * isIterable(new Map()); // true
 * isIterable(new Set()); // true
 */
export function isIterable<T = unknown>(target: any): target is Iterable<T> {
  try {
    for (const _ of target) {
      break;
    }
    return true;
  } catch (e) {
    return false;
  }
}
