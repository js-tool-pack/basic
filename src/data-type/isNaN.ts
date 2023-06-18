import { isNumber } from './isNumber';

/**
 *
 * 判断目标是否是 NaN
 *
 * 跟 es6 的 Number.isNaN 一致，如无必要还是直接用 Number.isNaN 更好
 *
 * window.isNaN 会把非数字类型强转为数字类型再判断是不是NaN，不推荐使用 window.isNaN
 *
 * 判定方式：isNumber(target) && target !== target
 * @example
 *
 * const n = NaN;
 * n === n; // false
 * Number.isNaN(n); // true
 * isNaN(NaN); // true
 * isNaN({ a: 1 }); // false
 * isNaN(1); // false
 * isNaN(0); // false
 * isNaN(-1); // false
 * isNaN(false); // false
 * isNaN(undefined); // false
 * Number.isNaN(undefined); // false
 * isNaN(null); // false
 * Number.isNaN(null); // false
 * isNaN(''); // false
 * isNaN({}); // false
 * isNaN({ a: 1 }); // false
 * isNaN([]); // false
 * Number.isNaN([]); // false
 * isNaN([1, 2, 3]); // false
 * isNaN(['bdsdf', 12323]); // false
 * isNaN('123'); // false
 * isNaN('NaN'); // false
 * Number.isNaN('kfsd'); // false
 * window.isNaN('NaN' as any); // true
 */
export function isNaN(target: unknown): boolean {
  // return String(target) === "NaN"; // "NaN" 会被判断为true
  return isNumber(target) && target !== target;
}
