/**
 * 判断对象是否包含某个属性。
 *
 * 因为直接object.hasOwnProperty(key)的话object可能会是null,所以另外封装一个函数使用。
 * 可以用作类型守卫：见example。
 *
 * TODO 该工具与Object.hasOwn一致，属于polyfill性质，不过Object.hasOwn毕竟是es2022的新api，过几年后可移除该polyfill工具
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
export function hasOwn<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key as keyof T);
}
