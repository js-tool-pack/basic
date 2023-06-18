import { isBroadlyObj, typeOf } from '../data-type';
import { hasOwn } from '../object';

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
