/**
 * 判断是否内置方法
 *
 * @example
 * isNative(Array.prototype.forEach); // true
 * isNative(Array.prototype.map); // true
 * const map = Array.prototype.map;
 * isNative(map); // true
 * isNative(() => {}); // false
 * isNative(Object.assign); // true
 * isNative(Object); // true
 * isNative(Boolean); // true
 * isNative(window.isNaN); // true
 * isNative(isNaN); // false
 */
export function isNative(value: unknown): boolean {
  const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  const reIsNative = RegExp(
    `^${Function.prototype.toString
      .call(Object.prototype.hasOwnProperty)
      .replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\])/g, '$1.*?')}$`,
  );
  return isBroadlyObj(value) && reIsNative.test(value as any);
}

/**
 * 获取数据类型
 *
 * @example
 * // 六大基本类型 string boolean number object null undefined
 * typeOf(''); // 'string'
 * typeOf(true); // 'boolean'
 * typeOf(0); // 'number'
 * typeOf(undefined); // 'undefined'
 * typeOf({}); // 'object'
 * typeOf(null); // 'null'
 * // 非6
 * typeOf(() => {}); // 'function'
 * typeOf([]); // 'array'
 * typeOf(NaN); // 'number'
 * typeOf(/abc/); // 'regexp'
 *
 */
export function typeOf(target: unknown): string {
  const tp = typeof target;
  if (tp !== 'object') return tp;
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

/**
 * 判断目标是否是对象，不包含Array,Function
 *
 * 判定方式：typeOf(target) === 'object'
 *
 * @example
 * isObject(123123); // false
 * isObject(undefined); // false
 * isObject(123123); // false
 * isObject(''); // false
 * // null
 * typeof null === 'object'; // true
 * isObject(null); // false
 * // array
 * typeof [] === 'object'; // true
 * isObject([]); // false
 * //
 * isObject({}); // true
 * // function
 * const f = () => {};
 * typeof f === 'object'; // false
 * isObject(f); // false
 * isObject(function () {}); // false
 *
 */
export function isObject(target: unknown): target is object {
  return typeOf(target) === 'object';
}

/**
 * 判断是否类对象(object like)|广义上的对象, 包含Array,Function
 *
 * @alias isBroadlyObj
 *
 * @example
 *
 * isObjectLike([1, 2, 3]); // true
 * isObjectLike([]); // true
 * isObjectLike('1'); // false
 * isObjectLike(1); // false
 * isObjectLike(true); // false
 * isObjectLike(undefined); // false
 * isObjectLike(null); // false
 * isObjectLike({}); // true
 * isObjectLike(() => {}); // true
 *
 */
export function isObjectLike(value: unknown): value is object {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
}

/**
 * @see isObjectLike
 * @alias isObjectLike
 */
export const isBroadlyObj = isObjectLike;

/**
 * 判断目标是否是数组
 *
 * 判定方式：typeOf(target) === 'array'
 *
 * 跟Array.isArray()一样
 *
 * @example
 *
 * Array.isArray(0.12345667); // false
 * isArray(0.12345667); // false
 *
 * Array.isArray(''); // false
 * isArray(''); // false
 *
 * Array.isArray({}); // false
 * isArray({}); // false
 *
 * Array.isArray({ 0: 1, 1: 2, length: 2 }); // false
 * isArray({ 0: 1, 1: 2, length: 2 }); // false
 *
 * Array.isArray(() => {}); // false
 * isArray(() => {}); // false
 *
 * Array.isArray(true); // false
 * isArray(true); // false
 *
 * Array.isArray(NaN); // false
 * isArray(NaN); // false
 *
 * Array.isArray(undefined); // false
 * isArray(undefined); // false
 *
 * Array.isArray(null); // false
 * isArray(null); // false
 *
 * Array.isArray([1, 2, 3]); // true
 * isArray([1, 2, 3]); // true
 *
 * Array.isArray([]); // true
 * isArray([]); // true
 *
 * Array.isArray(document.getElementsByClassName('test')); // false
 * isArray(document.getElementsByClassName('test')); // false
 */
export function isArray(target: unknown): target is Array<unknown> {
  return typeOf(target) === 'array';
}

/**
 * 类数组对象(包含数组、{0:1,1:2,length:2}、字符串)
 *
 * jq的实现方式
 *
 * @example
 * isArrayLike([1, 2, 3]); // true
 * isArrayLike([]); // true
 * isArrayLike({ length: 1, 0: 1 }); // true
 * isArrayLike({ length: 2, 0: 1 }); // false
 * isArrayLike('1'); // true
 * isArrayLike(1); // false
 * isArrayLike(true); // false
 * isArrayLike(undefined); // false
 * isArrayLike(null); // false
 * isArrayLike({}); // false
 * isArrayLike(() => {}); // false
 * isArrayLike(document.getElementsByClassName('test')); // true
 * isArrayLike(document.querySelectorAll('.test')); // true
 */
export function isArrayLike(target: any): target is ArrayLike<any> {
  // 检测target的类型
  const type = typeOf(target);
  // string也是ArrayLike，但"length" in target会报错
  if (type === 'string') return true;
  if ([/*"string",*/ 'null', 'undefined', 'number', 'boolean'].indexOf(type) > -1) return false;
  // 如果target非null、undefined等，有length属性，则length等于target.length
  // 否则，length为false
  const length = !!target && 'length' in target && target.length;
  // 如果target是function类型 或者是window对象 则返回false
  if (type === 'function' || target === window) {
    return false;
  }
  // target本身是数组，则返回true
  // target不是数组，但有length属性且为0，例如{length : 0}，则返回true
  // target不是数组,但有length属性且为整数数值，target[length - 1]存在，则返回true
  return (
    type === 'array' || length === 0 || (isNumber(length) && length > 0 && length - 1 in target)
  );
}

/**
 * 判断目标是否是字符串
 *
 * 判定方式：typeOf(target) === 'string'
 *
 * ```ts
 * isString(123123); // false
 * isString(''); // true
 * isString(``); // true
 *```
 */
export function isString(target: unknown): target is string {
  return typeOf(target) === 'string';
}

/**
 * 判定目标是否是数字
 *
 * 判定方式：typeOf(target) === 'number'
 *
 * @example
 *
 * isNumber(''); // false
 * isNumber({}); // false
 * isNumber({ 0: 1, 1: 2, length: 2 }); // false
 * isNumber(() => {}); // false
 * isNumber(true); // false
 * isNumber(undefined); // false
 * isNumber(null); // false
 * isNumber([1, 2, 3]); // false
 * isNumber([]); // false
 * isNumber(NaN); // true
 * isNumber(123); // true
 */
export function isNumber(target: unknown): target is number {
  return typeOf(target) === 'number';
}

/**
 * 判断目标是否是函数
 *
 * 判定方式：typeOf(target) === 'function'
 *
 * @example
 * isFunction(''); // false
 * isFunction(() => {}); // true
 * isFunction(function () {}); // true
 */
export function isFunction(target: unknown): target is Function {
  return typeOf(target) === 'function';
}

/**
 * 判断目标是否是boolean
 *
 * 判定方式：typeOf(target) === 'boolean'
 *
 * @example
 *
 * isBoolean(0); // false
 * isBoolean(123123); // false
 * isBoolean(undefined); // false
 * isBoolean(''); // false
 * isBoolean(null); // false
 * isBoolean([]); // false
 * isBoolean({}); // false
 *
 */
export function isBoolean(target: unknown): target is boolean {
  return typeOf(target) === 'boolean';
}

/**
 * 判断目标是否是undefined
 *
 * 判定方式：target === void 0
 *
 * 最安全的方式还是直接用 typeof target === 'undefined' 判断，
 * 这种方式就算target是未声明的变量也不会报错
 *
 * @example
 *
 * isUndefined(0); // false
 * isUndefined(123123); // false
 * isUndefined(''); // false
 * isUndefined(null); // false
 * isUndefined([]); // false
 * isUndefined(undefined); // true
 * let a;
 * isUndefined(a); // true
 */
export function isUndefined(target: any): target is undefined {
  return target === void 0;
}

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

/**
 * 判断数字是否整数
 *
 * 跟 es6 的 Number.isInteger一致，推荐直接使用 Number.isInteger
 *
 * 判定方式：value % 1 === 0
 * @example
 *
 * isInteger(1); // true
 * isInteger(Number.MAX_SAFE_INTEGER); // true
 * isInteger(Number.MIN_SAFE_INTEGER); // true
 * isInteger(0); // true
 * isInteger(-0); // true
 * isInteger(0.1); // false
 * isInteger(-0.1); // false
 * isInteger(-1.1); // false
 * isInteger(NaN); // false
 * isInteger(Infinity); // false
 */
export function isInteger(value: number): boolean {
  return value % 1 === 0;
}

// type t = "number" | "string" | "object" | "array" | "function" | "undefined" | "null" | "boolean" | "regexp"
/**
 * 用typeIn("123", ["string", "number"]) 代替  typeOf("123") === "string" || typeOf("123") === "number"
 *
 * 注意： 只能判断typeOf能够判断的类型   不能判断是否是NaN 是否是""
 *
 * 判定方式：types.indexOf(typeOf(target)) > -1
 *
 * @example
 * inTypes(0, ['string', 'number']); // true
 * inTypes(0, ['string', 'function', 'object']); // false
 */
export function inTypes(target: unknown, types: string[]): boolean {
  return types.indexOf(typeOf(target)) > -1;
}

/**
 * 判断目标是否是promise like
 *
 * 参考is-promise
 *
 * @example
 *
 * isPromiseLike({}); // false
 * isPromiseLike(Promise.resolve()); // true
 * isPromiseLike(null); // false
 * isPromiseLike(null); // false
 * isPromiseLike(undefined); // false
 * isPromiseLike(0); // false
 * isPromiseLike(-42); // false
 * isPromiseLike(42); // false
 * isPromiseLike(''); // false
 * isPromiseLike('then'); // false
 * isPromiseLike(false); // false
 * isPromiseLike(true); // false
 * isPromiseLike({}); // false
 * isPromiseLike({ then: true }); // false
 * isPromiseLike([]); // false
 * isPromiseLike([true]); // false
 * isPromiseLike(() => {}); // false
 *
 * const promise = {
 *   then: () => {},
 * };
 * isPromiseLike(promise); // true
 * const fn = () => {};
 * fn.then = () => {};
 * isPromiseLike(fn); // true
 */
export function isPromiseLike<T, S>(target: PromiseLike<T> | S): target is PromiseLike<T> {
  const type = typeof target;
  return (
    !!target /*null也是object*/ &&
    (type === 'object' || type === 'function') &&
    typeof (target as any).then === 'function'
  );
}

/**
 * 判断是否是空object
 *
 * @example
 * isEmptyObject({}); // true
 * isEmptyObject({ a: 1 }); // false
 * isEmptyObject({ true: 1 }); // false
 * isEmptyObject({ false: 1 }); // false
 * isEmptyObject({ 0: 1 }); // false
 * isEmptyObject({ undefined: 1 }); // false
 * isEmptyObject({ null: 1 }); // false
 * isEmptyObject([]); // false
 * isEmptyObject(function () {}); // false
 */
export function isEmptyObject(target: object): boolean {
  if (!isObject(target)) return false;
  for (const i in target) {
    return i === undefined;
  }
  return true;
}

/**
 * 判断是否是空值 undefined, null, "", [], {} ,NaN都为true
 *
 * @example
 *
 * isEmpty(NaN); // true
 * isEmpty(''); // true
 * isEmpty({}); // true
 * isEmpty([]); // true
 * isEmpty({ a: 1 }); // false
 * isEmpty([1]); // false
 * isEmpty(0); // false
 * isEmpty(function () {}); // false
 * isEmpty({ a: function () {}})); // false;
 */
export function isEmpty(target: any): boolean {
  if ([undefined, null, '', NaN].includes(target)) return true;
  switch (typeOf(target)) {
    case 'array':
      return !target.length;
    case 'object':
      // {a(){}} 使用JSON.stringify是会判断为空的
      // return JSON.stringify(target) === "{}";
      return isEmptyObject(target);
  }
  return false;
}

/**
 * 判断两个变量是否相等,值比较，如果是对象则递归判断
 *
 * @example
 *
 * isEqual({ a: 1 }, { a: 1 }); // true
 * isEqual({ a: 1 }, { a: 2 }); // false
 * isEqual(1, 1); // true
 * isEqual(1, 2); // false
 * isEqual(1, '1'); // false
 * isEqual(0, ''); // false
 * isEqual(0, false); // false
 * isEqual(0, null); // false
 * isEqual(0, undefined); // false
 * isEqual(null, undefined); // false
 * isEqual(false, undefined); // false
 * isEqual(false, null); // false
 * isEqual(false, true); // false
 * isEqual([1, 2], { 0: 1, 1: 2, length: 2 }); // false
 * isEqual(() => {}, () => {}); // false
 * isEqual(cm.polling, cm.polling); // true
 * isEqual([1, 2], [1, 2]); // true
 * isEqual(null, null); // true
 * isEqual(undefined, undefined); // true
 * isEqual(false, false); // true
 * isEqual(NaN, NaN); // true
 * isEqual('', ''); // true
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  const aType = typeOf(a);
  const bType = typeOf(b);
  if (aType !== bType) return false;
  // noinspection FallThroughInSwitchStatementJS
  switch (aType) {
    case 'boolean':
    case 'string':
    case 'function':
      return false;
    case 'number':
      return isNaN(b);
    //  只有数组或者object不相等的时候才去对比是否相等
    case 'array':
    case 'object':
    default:
      return objectIsEqual(a, b);
  }
}

/**
 * 递归判断两个对象是否相等
 * @example
 *
 * const obj = { a: 1 };
 * objectIsEqual(obj, obj); // true
 * objectIsEqual(obj, { a: 1 }); // true
 * objectIsEqual(obj, { a: 2 }); // false
 */
export function objectIsEqual(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
  if (obj1 === obj2) return true;
  for (const key in obj1) {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (!isEqual(value1, value2)) {
      return false;
    }
  }
  return true;
}

/**
 * 判断两个数据类型是否相等
 *
 * @example
 *
 * isSameType(cm, cm); // true
 * isSameType(1, 2); // true
 * isSameType('', new String(123)); // true
 * isSameType(1, NaN); // true
 * isSameType(1, ''); // false
 * isSameType({}, []); // false
 * isSameType({}, () => 0); // false
 * isSameType({}, null); // false
 */
export function isSameType(a: unknown, b: unknown): boolean {
  return typeOf(a) === typeOf(b);
}

/**
 * 判断目标是否可迭代
 *
 * @example
 *
 * isIterable(null); // false
 * isIterable(undefined); // false
 * isIterable(0); // false
 * isIterable(true); // false
 * isIterable({}); // false
 * isIterable(Symbol('123')); // false
 * isIterable(''); // true
 * isIterable([]); // true
 * isIterable([0, 1]); // true
 * isIterable(new Map()); // true
 * isIterable(new Set()); // true
 */
export function isIterable(target: any): target is Iterable<any> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of target) {
      break;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 判断字符串是否是百分比
 * @example
 *
 * isPercent('123$%'); // false
 * isPercent('3%'); // true
 * isPercent('3.0%'); // true
 * isPercent('3.1%'); // true
 * isPercent('100%'); // true
 * isPercent('100%'); // true
 * isPercent('100%1'); // false
 * isPercent('100% '); // true
 * isPercent('10..0% '); // false
 * isPercent('10.0.0% '); // false
 * isPercent('.1% '); // false
 * isPercent(''); // false
 * isPercent(' '); // false
 */
export function isPercent(value: string): boolean {
  const reg = /^\d+(\.\d+)?%$/;
  return reg.test(value.trim());
}

/**
 * 是否包含中文
 *
 * @example
 *
 * isIncludeChinese('哈'); // true
 * isIncludeChinese('哈水电费第三方'); // true
 * isIncludeChinese('哈水电费1第三方'); // true
 * isIncludeChinese('哈水电费.第三方'); // true
 * isIncludeChinese('哈水电费_第三方'); // true
 * isIncludeChinese('哈水电费 第三方'); // true
 * isIncludeChinese(''); // false
 * isIncludeChinese('1231'); // false
 * isIncludeChinese('-='); // false
 * isIncludeChinese(' '); // false
 * isIncludeChinese('$$%%'); // false
 */
export function includesChinese(value: string): boolean {
  return /[\u4e00-\u9fa5]/.test(value);
}

/**
 * 判断是否是数组对象
 *
 * @example
 * isArrayObj(Object.assign([1, 2], { b: '1', c: '2' })); // true
 * isArrayObj([]); // false
 * isArrayObj({ 0: 1, 1: 2, length: 2, a: 1, b: 2 }); // false
 * isArrayObj(document.querySelectorAll('.test')); // false
 * isArrayObj(document.getElementsByClassName('test')); // false
 */
export function isArrayObj(value: any): boolean {
  const reg = /\d+/;
  return isArray(value) && Object.keys(value).some((i) => !reg.test(i));
}
