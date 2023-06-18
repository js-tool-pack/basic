import { unique } from '../../array';

/**
 * 获取class实例的key数组
 *
 * @example
 *
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
 * const superKeys = ['a', 'b', 'fn1', 'len', 'test'].sort();
 * const subKeys = ['c', 'fn2', ...superKeys].sort();
 *
 * getInsKeys(new UpdateTestSuperClass()).sort(); // superKeys
 *
 * getInsKeys(new UpdateTestClass()).sort(); // subKeys
 *
 * // 不会继承method
 * const obj = { a1: 1, b2: 2, c3: 3, ...new UpdateTestClass() };
 * getInsKeys(obj).sort(); // ['a', 'b', 'c', 'a1', 'b2', 'c3'].sort()
 *
 * const obj2 = Object.create(new UpdateTestClass());
 * getInsKeys(obj2).sort(); // subKeys
 *
 * const obj3 = Object.create(null);
 * obj3.a = 1;
 * obj3.b = 2;
 * getInsKeys(obj3).sort(); // ['a', 'b']
 */
export function getInsKeys(ins: Record<string, any>): Array<string | symbol> {
  const result: Array<string | symbol> = [];
  let cur: Record<string, any> = ins;
  while (cur) {
    // 普通key
    result.push(...Object.keys(cur));

    // 使用 Object.getPrototypeOf 代替 cur.__proto__
    const proto = Object.getPrototypeOf(cur);
    if (!proto || proto === Object.prototype) {
      // 构造器为原生函数的话就不是class
      // 或者对象原型和 Object 的原型一样则不是class
      // 或者 Object.create(null) 创建的纯对象，prototype为null, __proto__为undefined
      break;
    } else {
      // method key
      result.push(...Reflect.ownKeys(proto));
    }
    cur = proto;
  }

  // 过滤掉构造方法,并去重
  return unique(result.filter((k) => k !== 'constructor'));
}
