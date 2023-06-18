/**
 * 影子对象
 * ---
 * 有时候需要根据一个对象新建一个对象，而且对该对象的操作不能影响原对象，
 * 使用解构或者Object.assign生成一个新对象太浪费空间
 *
 * 直接使用内部操作也是可以的，该方法主要是可以避免声明一个中间变量
 *
 * @example
 *
 * const origin = { a: 1, b: 2 };
 * const res = shadowObj(origin, { c: 3 });
 * console.log(res, res.a === origin.a, res.b === origin.b); // { c: 3 }, true, true
 *
 * @param origin 原对象
 * @param cover 覆盖原对象
 */
export function shadowObj<T extends object, C extends Record<PropertyKey, any>>(
  origin: T,
  cover: C,
): T extends C ? T : T & C {
  const result = Object.create(origin);
  Object.assign(result, cover);
  return result;
}
