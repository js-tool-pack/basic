import { isBroadlyObj, typeOf } from './data-type';
import { hasOwn } from './object';

/**
 * 对函数复制
 *
 * 如果要复制函数属性的话，使用deepClone
 *
 * 只能复制部分函数，部分函数会丢失外部作用域
 *
 * @throws 部分环境像electron可能会因为不能使用eval而复制失败
 *
 * @example
 *
 * // 复制普通函数
 * function test(a: number, b: number) {
 *   return a + b;
 * }
 *
 * cloneFunction(test)(50, 50); // 100
 *
 * // 复制箭头函数
 * const test2 = (a: number, b: number) => a + b;
 * cloneFunction(test2)(50, 50); // 100
 *
 * // 复制匿名函数
 * cloneFunction(function (a: number, b: number) {
 *   return a + b;
 * })(50, 50); // 100
 *
 * // 复制非函数
 * cloneFunction(1 as any); // 1
 *
 * // ---------- 以上复制正常运行 ----------
 *
 * // 复制对象方法
 * const obj: any = {
 *   a: 1,
 *   b: 1,
 *   c: 1,
 *   fn1() {
 *     return ++this.a;
 *   },
 *   fn2: () => ++obj.b,
 *   fn3: function () {
 *     return ++this.c;
 *   },
 * };
 * obj.clone1 = cloneFunction(obj.fn1);
 * obj.fn1(); // 2
 * obj.clone1(); // 3
 *
 * obj.clone2 = cloneFunction(obj.fn2);
 * typeof obj.clone2; // 'function'
 * obj.clone2()); // throw 'obj is not defined'
 *
 * obj.clone3 = cloneFunction(obj.fn3);
 * obj.clone3(); // 2
 *
 * obj.a; // 3
 * obj.b; // 1
 * obj.c; // 2
 *
 * // -------- 以上复制除了箭头函数无法访问obj，其他都是正常的 ---------
 *
 * // 对外部变量对访问
 * const o = { a: 1 };
 *
 * const fn = () => o.a;
 * cloneFunction(fn)());// throw 'o is not defined';
 *
 * cloneFunction(function () {
 *     return o.a;
 *   })(),
 * ); // throw 'o is not defined'
 *
 * // --------- 以上复制运行全部出错 ----------
 *
 *
 */
export function cloneFunction<T extends Function>(fn: T): T {
  if (typeOf(fn) !== 'function') return fn;

  let str = fn.toString();
  // fn(){} es6写法的函数要转换成function(){}
  str = str.replace(/(function)? ?\w+ ?\(/, 'function(');
  // let newFn: any;
  // str = "newFn = " + str;
  // (0, eval)(str); // 直接使用eval在rollup build的时候会报错 (0, eval)(str)在nodejs里面不会有效
  // return newFn;

  // 用new Function(str)代替eval(str)
  return new Function('return ' + str)();
}

interface CloneStrategies {
  [key: string]: (target: any) => any;
}
const cloneStrategies: CloneStrategies = (function () {
  const st = {
    array(target: any) {
      return new target.constructor();
    },
    function(target: any) {
      // 复制的函数作用域不再是原函数的作用域
      // (如复制一个闭包函数，作用域会提升到script顶层，将不能访问原闭包函数外的变量)，
      // 不再复制函数
      // return cloneFunction(target);
      return target;
    },
    date(target: any) {
      return new target.constructor(target);
    },
  };
  const strategies: CloneStrategies = {
    ...st,
    object: st.array,
    regexp: st.date,
  };

  return strategies;
})();

/**
 * 对象深拷贝办法(深度优先)
 *
 * @example
 *
 * const obj = { a: [2, 3], c: 1, d: { f: 123 } };
 * const newObj = deepClone(obj);
 * // copy == obj
 * isEqual(newObj,obj); // true
 * // copy !== obj
 * obj === newObj; // false
 * // copy.a == obj.a
 * isEqual(obj.a,newObj.a); // true
 * // copy.a !== obj.a
 * obj.a === newObj.a; // false
 *
 * // 0 === 0
 * deepClone(0); // 0
 *
 */
export function deepClone<T>(target: T): T {
  const cache = new Set();

  function _clone(value: any) {
    const type = typeOf(value);
    const isObject = isBroadlyObj(value as any);
    if (isObject) {
      if (cache.has(value)) return value;
      // 非引用类型不缓存
      cache.add(value);
    }
    // 使用策略模式
    const strategies = cloneStrategies[type];
    const result: any = strategies ? strategies(value) : value;
    if (['object', 'array', 'function'].indexOf(type) === -1) return result;
    const tar: any = value;
    // 虽然array使用for i++比for in遍历快，但是如果在数组里面有非number类型的键的话，就无法复制，所以统一用for in遍历
    for (const k in tar) {
      //prototype继承的不复制  es6继承的不会被拦截
      if (!hasOwn(tar, k)) continue;
      result[k] = _clone(tar[k]); // 递归复制
    }
    return result;
  }

  return _clone(target);
}

/**
 * 对象深拷贝办法(广度优先)
 *
 * @example
 *
 * const obj = { a: [2, 3], c: 1, d: { f: 123 } };
 * const newObj = deepCloneBfs(obj);
 * // copy == obj
 * isEqual(newObj,obj); // true
 * // copy !== obj
 * obj === newObj; // false
 * // copy.a == obj.a
 * isEqual(obj.a,newObj.a); // true
 * // copy.a !== obj.a
 * obj.a === newObj.a; // false
 *
 */
export function deepCloneBfs<T>(target: T): T {
  if (typeof target !== 'object' || !target) return target;
  type QueItem = [string, any, any];
  const result: any = new (target as any).constructor();

  function getChildren(tar: object, parent: any) {
    for (const k in tar) {
      if (!hasOwn(tar, k)) continue;
      queue.push([k, tar[k], parent]);
    }
  }

  const queue: QueItem[] = [];
  getChildren(target as any, result);

  while (queue.length) {
    const [k, v, parent] = queue.shift() as QueItem;

    const type = typeof v;
    // console.log(type);
    if (type !== 'object' || v === null) {
      parent[k] = v;
      continue;
    }

    if (parent[k] === undefined) {
      parent[k] = new v.constructor();
    }
    getChildren(v, parent[k]);
  }
  return result;
}
