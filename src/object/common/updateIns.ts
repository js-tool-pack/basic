import { getInsKeys } from './getInsKeys';
import { _updateObj } from './_updateObj';

/**
 * 更新实例对象属性
 *
 * updateIns可以代替updateObj使用，
 * 不过由于遍历了实例及原型的key，所以理论上updateIns会比updateObj慢一点
 *
 * @see updateObj
 *
 * @example
 *
 * updateIns({ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { d: 4 }); // { a: 1, b: 2, c: 3, }
 * updateIns({ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { c: undefined }); // { a: 1, b: 2, c: undefined, }
 * updateIns({ a: 12, b: undefined, c: 3 }, { aa: 2, bb: 2, dd: 123 }, { c: undefined }); // { a: 12, b: undefined, c: undefined, }
 *
 * updateIns({ a: 12, b: undefined, c: 3 }, null as any, undefined as any); // { a: 12, b: undefined, c: 3, }
 *
 * const obj = { a: 1, b: 2 };
 * isEqual(updateIns(obj, obj), obj); // true
 * isEqual(updateIns(obj, obj), { a: 1, b: 2 }); // true
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
 * // updateIns 会更新实例的方法
 * const ins = fn(new UpdateTestClass(), {
 *   fn1() {
 *     return 'replace fn1';
 *   },
 *   fn2() {
 *     return 'replace fn2';
 *   },
 * });
 * ins.fn1(); // 'replace fn1'
 * ins.fn2(); // 'replace fn2'
 *
 */
export function updateIns<T extends object>(target: T, ...others: object[]): T {
  if (others[others.length - 1] === target) return target;
  const keys = getInsKeys(target);
  keys.forEach((k) => _updateObj(target, others, k as keyof T));
  return target;
}
