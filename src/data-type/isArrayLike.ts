import { typeOf } from './typeOf';
import { isNumber } from './isNumber';

/**
 * 类数组对象(包含数组、{0:1,1:2,length:2}、字符串)
 *
 * jq的实现方式
 *
 * @example
 * isArrayLike([1, 2, 3]); // true
 * isArrayLike([]); // true
 * isArrayLike({ length: 1, 0: 1 }); // true
 * isArrayLike({ length: 2, 0: 1 }); // false
 * isArrayLike('1'); // true
 * isArrayLike(1); // false
 * isArrayLike(true); // false
 * isArrayLike(undefined); // false
 * isArrayLike(null); // false
 * isArrayLike({}); // false
 * isArrayLike(() => {}); // false
 * isArrayLike(document.getElementsByClassName('test')); // true
 * isArrayLike(document.querySelectorAll('.test')); // true
 */
export function isArrayLike(target: any): target is ArrayLike<any> {
  // 检测target的类型
  const type = typeOf(target);
  // string也是ArrayLike，但"length" in target会报错
  if (type === 'string') return true;
  if ([/*"string",*/ 'null', 'undefined', 'number', 'boolean'].indexOf(type) > -1) return false;
  // 如果target非null、undefined等，有length属性，则length等于target.length
  // 否则，length为false
  const length = !!target && 'length' in target && target.length;
  // 如果target是function类型 或者是window对象 则返回false
  if (type === 'function' || target === window) {
    return false;
  }
  // target本身是数组，则返回true
  // target不是数组，但有length属性且为0，例如{length : 0}，则返回true
  // target不是数组,但有length属性且为整数数值，target[length - 1]存在，则返回true
  return (
    type === 'array' || length === 0 || (isNumber(length) && length > 0 && length - 1 in target)
  );
}
