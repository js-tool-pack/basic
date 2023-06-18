import { typeOf } from '../data-type';

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
