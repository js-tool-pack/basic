import { forEachObj } from '../iterate';
import { _updateObj } from './_updateObj';

/**
 * 使用其他对象去更新目标对象
 *
 * 使用target里面的key去查找其他的对象，如果其他对象里有该key，则把该值赋给target,如果多个对象都有同一个值，则以最后的为准
 * 会更新原对象
 *
 * 如果要更新某个class的实例，那么需要使用updateIns
 *
 * @see updateIns
 *
 * @example
 *
 * updateObj({ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { d: 4 }); // { a: 1, b: 2, c: 3, }
 * updateObj({ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { c: undefined }); // { a: 1, b: 2, c: undefined, }
 * updateObj({ a: 12, b: undefined, c: 3 }, { aa: 2, bb: 2, dd: 123 }, { c: undefined }); // { a: 12, b: undefined, c: undefined, }
 *
 * updateObj({ a: 12, b: undefined, c: 3 }, null as any, undefined as any); // { a: 12, b: undefined, c: 3, }
 *
 * const obj = { a: 1, b: 2 };
 * isEqual(updateObj(obj, obj), obj); // true
 * isEqual(updateObj(obj, obj), { a: 1, b: 2 }); // true
 *
 * @example
 *
 * // 更新class实例
 * class UpdateTestSuperClass {
 *  a = 1;
 *  b = 2;
 *  private test() {
 *    return 'super test';
 *  }
 *  fn1() {
 *    return 'super fn1';
 *  }
 *  get len() {
 *    this.test();
 *    return 0;
 *  }
 * }
 * class UpdateTestClass extends UpdateTestSuperClass {
 *   c = 3;
 *   fn2() {
 *     return 'sub fn2';
 *   }
 *   override get len() {
 *     return 1;
 *   }
 * }
 *
 * // objUpdate 不会更新实例的方法
 * const ins = updateObj(new UpdateTestClass(), {
 *   fn1() {
 *     return 'replace fn1';
 *   },
 *   fn2() {
 *     return 'replace fn2';
 *   },
 * });
 * ins.fn1(); // 'super fn1'
 * ins.fn2(); // 'sub fn2'
 *
 */
export function updateObj<T extends object>(target: T, ...others: object[]): T {
  if (others[others.length - 1] === target) return target;
  forEachObj(target, (_v, k) => _updateObj(target, others, k));
  return target;
}

// export function updateObj<T extends object>(target: T, ...others: object[]): T {
//   for (const k in target) {
//     for (let i = others.length - 1; i > -1; i--) {
//       const item = others[i];
//       if (item && hasOwn(item, k)) {
//         target[k] = item[k];
//         break;
//       }
//     }
//   }
//
//   return target;
// }
