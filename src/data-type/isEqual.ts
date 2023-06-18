import { typeOf } from './typeOf';
import { objectIsEqual } from './objectIsEqual';

/**
 * 判断两个变量是否相等,值比较，如果是对象则递归判断
 *
 * @example
 *
 * isEqual({ a: 1 }, { a: 1 }); // true
 * isEqual({ a: 1 }, { a: 2 }); // false
 * isEqual(1, 1); // true
 * isEqual(1, 2); // false
 * isEqual(1, '1'); // false
 * isEqual(0, ''); // false
 * isEqual(0, false); // false
 * isEqual(0, null); // false
 * isEqual(0, undefined); // false
 * isEqual(null, undefined); // false
 * isEqual(false, undefined); // false
 * isEqual(false, null); // false
 * isEqual(false, true); // false
 * isEqual([1, 2], { 0: 1, 1: 2, length: 2 }); // false
 * isEqual(() => {}, () => {}); // false
 * isEqual(cm.polling, cm.polling); // true
 * isEqual([1, 2], [1, 2]); // true
 * isEqual(null, null); // true
 * isEqual(undefined, undefined); // true
 * isEqual(false, false); // true
 * isEqual(NaN, NaN); // true
 * isEqual('', ''); // true
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  const aType = typeOf(a);
  const bType = typeOf(b);
  if (aType !== bType) return false;
  // noinspection FallThroughInSwitchStatementJS
  switch (aType) {
    case 'boolean':
    case 'string':
    case 'function':
      return false;
    case 'number':
      return isNaN(b);
    //  只有数组或者object不相等的时候才去对比是否相等
    case 'array':
    case 'object':
    default:
      return objectIsEqual(a, b);
  }
}
