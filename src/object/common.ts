import { forEachRight, unique } from '../array';
import { forEachObj, reduceObj } from './iterate';

/**
 * 合并两个object
 *
 * TODO 可优化
 *
 * @example
 *
 * // 对象合并
 * const a = { one: 1, two: 2, three: 3 };
 * const b = { one: 11, four: 4, five: 5 };
 * deepMerge(a, b); // Object.assign({}, a, b)
 *
 * // 嵌套对象合并
 * const c = { ...a, test: { a: 1, b: 2, c: 3 } };
 * deepMerge(c, b); // Object.assign({}, c, b)
 * deepMerge(c, b).test.a === 1; // true
 * // 第二个对象中不存在属性也会重新复制
 * deepMerge(c, b).test !== c.test; // true
 *
 * // 合并类实例
 * function Fn(this: any) {
 *   this.a = 100;
 * }
 *
 * Fn.prototype.b = 200;
 *
 * const d = new Fn();
 * deepMerge(a, d); // Object.assign({}, a, d)
 * // 不会合并继承属性
 * deepMerge(a, d).b; // undefined
 *
 * deepMerge(a, { a: [{ b: 123 }] }); // Object.assign({}, a, { a: [{ b: 123 }] })
 *
 */
export function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
  first: T,
  second: U,
): T & U {
  function assign(receive: Record<string, any>, obj: any) {
    for (const k in obj) {
      if (!hasOwn(obj, k)) continue;
      const v = obj[k];
      if (v && typeof v === 'object') {
        receive[k] = new v.constructor();
        assign(receive[k], v);
      } else receive[k] = v;
    }
  }

  const result: any = {};
  assign(result, first);
  assign(result, second);
  return result;
}

/**
 * object {key:value}翻转成{value:key}
 *
 * @example
 * const obj = { a: 'aa', b: 'bb' };
 * fn(obj); // { aa: 'a', bb: 'b' }
 *
 */
export function getReversedObj(obj: { [k: string]: string }): { [k: string]: string } {
  return reduceObj(
    obj,
    (res, v, k) => {
      res[v] = k;
      return res;
    },
    {} as Record<string, any>,
  );
}

/**
 * 根据新键值对重命名对象的key，并生成一个新的对象
 *
 * 跟pickRename类似，但不会pick，未改动的会原样返回
 *
 * @example
 *
 * renameObjKey({ a: 12, b: undefined, c: 3 }, { test: 'a', bb: 'b' }); // { test: 12,bb: undefined, c: 3, }
 * renameObjKey({ a: 12, b: undefined, c: 3 }, { test: 'aa' as any, bb: 'b' }); // { a: 12, bb: undefined, c: 3, }
 * renameObjKey({ a: 1, b: 2 }, { a: 'a', aa: 'a', aaa: 'a' }); // { a: 1, aa: 1, aaa: 1, b: 2, }
 */
export function renameObjKey<
  T extends object,
  K extends keyof T,
  O extends { [k: string]: K },
  R extends Omit<T, O[keyof O]>,
>(originObj: T, keyMap: O): { [k in keyof O]: T[O[k]] } & R {
  const result: any = Object.assign({}, originObj);
  const delKeys: K[] = [];
  const newKeys: string[] = [];

  forEachObj(keyMap, (originKey, k) => {
    if (hasOwn(result, originKey)) {
      result[k] = result[originKey];
      delKeys.push(originKey);
      newKeys.push(k as string);
    }
  });

  // 可能新key会与旧key同名，如果是同名则把该key从要删除的key数组中移除
  // delKeys = delKeys.filter(k => newKeys.indexOf(k as string) === -1);

  delKeys.forEach((k) => {
    if (newKeys.indexOf(k as string) > -1) return;
    delete result[k];
  });
  return result;
}

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

/**
 * 与lodash defaults一样 只替换origin里面的值为undefined的属性
 *
 * 在原对象上改
 *
 * @example
 *
 * const origin = { a: 12, b: undefined, c: 3, d: null, 0: undefined };
 * // 0个参数
 * defaults({ ...origin }); // origin
 * defaults({ ...origin }, null); // origin
 * defaults({ ...origin }, 1); // origin
 * // 1个参数
 * defaults({ ...origin }, { a: 1, b: 1 }); // { ...origin, b: 1 }
 * defaults({ ...origin }, '123'); // { ...origin, 0: '1', 1: '2', 2: '3' }
 */
export function defaults<T, U>(origin: T, source: U): T & U;
/**
 * 与lodash defaults一样 只替换origin里面的值为undefined的属性
 *
 * 在原对象上改
 *
 * @example
 *
 * const origin = { a: 12, b: undefined, c: 3, d: null, 0: undefined };
 * // 2个参数
 * defaults({ ...origin }, { a: 1, b: 1 }, { f: 5 }); // { ...origin, b: 1, f: 5 }
 */
export function defaults<T, U, V>(origin: T, source1: U, source2: V): T & U & V;
/**
 * 与lodash defaults一样 只替换origin里面的值为undefined的属性
 *
 * 在原对象上改
 *
 * @example
 *
 * const origin = { a: 12, b: undefined, c: 3, d: null, 0: undefined };
 * // 3个参数
 * defaults({ ...origin }, { a: 1, b: 1 }, { c: 0, d: 4 }, { f: 5, g: 6 }); // {...origin, b: 1, f: 5, g: 6, }
 *
 */
export function defaults<T, U, V, W>(origin: T, source1: U, source2: V, source3: W): T & U & V & W;
/**
 * 与lodash defaults一样 只替换origin里面的值为undefined的属性
 *
 * 在原对象上改
 *
 * @example
 *
 * const origin = { a: 12, b: undefined, c: 3, d: null, 0: undefined };
 * // 更多参数
 * defaults({ ...origin }, { a: 1, b: 1 }, { c: 0, d: 4 }, { f: 5, g: 6 }, { h: 7, i: 8 }),; // { ...origin, b: 1, f: 5, g: 6, h: 7, i: 8 }
 *
 */
export function defaults(origin: object, ...args: object[]): object;
export function defaults(origin: Record<string, any>, ...args: any[]) {
  args.forEach((arg) => {
    forEachObj(arg, (v, k) => {
      if (v === undefined || origin[k as string] !== undefined) return;
      origin[k as string] = v;
    });
  });
  return origin;
}

/**
 * 内部更新对象函数
 */
function _updateObj<T extends object>(target: T, others: object[], k: keyof T): void {
  // 从后往前查起
  forEachRight(others, (item): void | false => {
    if (item && hasOwn(item, k)) {
      target[k] = item[k];
      // 某个对象有这个key，那么就不再往前查
      return false;
    }
  });
}

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

/**
 * 判断对象是否包含某个属性。
 *
 * 因为直接object.hasOwnProperty(key)的话object可能会是null,所以另外封装一个函数使用。
 * 可以用作类型守卫：见example。
 *
 * @example
 *
 * const o = { a: 1 };
 * let k = 'a';
 * k = 'c';
 * // 报错需要在tsconfig.json设置
 * // "suppressImplicitAnyIndexErrors": false,
 * // "noImplicitAny": true,
 * o[k] = 2; // 此处没有类型守卫会报错
 * if (hasOwn(o, k)) {
 *   o[k] = 3; // 有类型守卫，安全
 * }
 *
 * @param obj
 * @param key
 */
export function hasOwn<T extends object>(obj: T, key: any): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 对象或数组key交换
 *
 * @example
 *
 * // 对象属性交换
 * swap({ a: 1, b: 2 }, 'a', 'b'); // { b: 1, a: 2 }
 * swap({ a: 1, b: 2 }, 'a', 'c' as any); // { c: 1, b: 2, a: undefined }
 * // 数组item交换
 * swap([1, 2], 1, 0); // [2, 1]
 * swap([1, 2], 1, 2); // [1, undefined, 2]
 */
export function swap<T extends object, K1 extends keyof T, K2 extends keyof T>(
  obj: T,
  k1: K1,
  k2: K2,
): T {
  const temp = obj[k1];
  obj[k1] = obj[k2] as any;
  obj[k2] = temp as any;
  return obj;
}

/**
 * 查找对象中与param key类似的key
 *
 * @example
 *
 * // array
 * likeKeys([1, 2, 3, 4, 5, 6, 7], '0'); // ['0']
 * likeKeys([1, 2, 3, 4, 5, 6, 7, 1, 1, 1, 1, 1, 1], '0'); // ['0', '10']
 *
 * // object
 * likeKeys({ test: 1, test2: 2, test3: 3 }, 'test'); // ['test', 'test2', 'test3']
 *
 * // map
 * const map = new Map<string, number | string>([
 *   ['aa', 1],
 *   ['bb', 2],
 *   ['hello', 'world'],
 * ]);
 * likeKeys(map, /a+|b+/); // ['aa', 'bb']
 */
export function likeKeys(target: object | Map<string, any>, key: string | RegExp): string[] {
  const reg = new RegExp(key);
  if ('undefined' !== typeof Map && target instanceof Map) {
    // keys = [...obj.keys()]; // babel编译成es5会编译成[].concat，无法使用
    const keys: string[] = [];
    for (const k of target.keys()) {
      if (reg.test(k)) keys.push(k);
    }
    return keys;
  }

  return Object.keys(target).filter((key) => reg.test(key));
}
