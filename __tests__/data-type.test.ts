import {
  isNative,
  typeOf,
  inTypes,
  isArray,
  isArrayLike,
  isArrayObj,
  isBoolean,
  isEmptyObject,
  isEqual,
  isFunction,
  includesChinese,
  isInteger,
  isIterable,
  isNumber,
  isObject,
  isPercent,
  isPromiseLike,
  isSameType,
  isString,
  isUndefined,
  objectIsEqual,
  isNaN,
  isEmpty,
  isObjectLike,
  isUnavailable,
  isNullish,
} from '../src';
const cm = { polling: {} };

describe('data-type', function () {
  test('isNative', function () {
    expect(isNative(Array.prototype.forEach)).toBe(true);
    expect(isNative(Array.prototype.map)).toBe(true);
    const map = Array.prototype.map;
    expect(isNative(map)).toBe(true);
    expect(isNative(() => {})).toBe(false);
    expect(isNative(Object.assign)).toBe(true);
    expect(isNative(Object)).toBe(true);
    expect(isNative(Boolean)).toBe(true);
    expect(isNative(window.isNaN)).toBe(true);
    expect(isNative(isNaN)).toBe(false);
  });
  test('typeOf', () => {
    // 六大基本类型 string boolean number object null undefined
    expect(typeOf('')).toBe('string');
    expect(typeOf(true)).toBe('boolean');
    expect(typeOf(0)).toBe('number');
    expect(typeOf(undefined)).toBe('undefined');
    expect(typeOf({})).toBe('object');
    expect(typeOf(null)).toBe('null');
    // 非6
    expect(typeOf(() => {})).toBe('function');
    expect(typeOf([])).toBe('array');
    expect(typeOf(NaN)).toBe('number');
    expect(typeOf(/abc/)).toBe('regexp');
  });
  test('isObject', () => {
    expect(isObject(123123)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(123123)).toBe(false);
    expect(isObject('')).toBe(false);
    // null
    expect(typeof null === 'object').toBe(true);
    expect(isObject(null)).toBe(false);
    // array
    expect(typeof [] === 'object').toBe(true);
    expect(isObject([])).toBe(false);
    //
    expect(isObject({})).toBe(true);
    // function
    const f = () => {};
    expect(typeof f === 'object').toBe(false);
    expect(isObject(f)).toBe(false);
    expect(isObject(function () {})).toBe(false);
  });
  test('isObjectLike', () => {
    expect(isObjectLike([1, 2, 3])).toBe(true);
    expect(isObjectLike([])).toBe(true);
    expect(isObjectLike('1')).toBe(false);
    expect(isObjectLike(1)).toBe(false);
    expect(isObjectLike(true)).toBe(false);
    expect(isObjectLike(undefined)).toBe(false);
    expect(isObjectLike(null)).toBe(false);
    expect(isObjectLike({})).toBe(true);
    expect(isObjectLike(() => {})).toBe(true);
  });
  test('isArray', () => {
    expect(Array.isArray(0.12345667)).toBe(false);
    expect(isArray(0.12345667)).toBe(false);

    expect(Array.isArray('')).toBe(false);
    expect(isArray('')).toBe(false);

    expect(Array.isArray({})).toBe(false);
    expect(isArray({})).toBe(false);

    expect(Array.isArray({ 0: 1, 1: 2, length: 2 })).toBe(false);
    expect(isArray({ 0: 1, 1: 2, length: 2 })).toBe(false);

    expect(Array.isArray(() => {})).toBe(false);
    expect(isArray(() => {})).toBe(false);

    expect(Array.isArray(true)).toBe(false);
    expect(isArray(true)).toBe(false);

    expect(Array.isArray(NaN)).toBe(false);
    expect(isArray(NaN)).toBe(false);

    expect(Array.isArray(undefined)).toBe(false);
    expect(isArray(undefined)).toBe(false);

    expect(Array.isArray(null)).toBe(false);
    expect(isArray(null)).toBe(false);

    expect(Array.isArray([1, 2, 3])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);

    expect(Array.isArray([])).toBe(true);
    expect(isArray([])).toBe(true);

    expect(Array.isArray(document.getElementsByClassName('test'))).toBe(false);
    expect(isArray(document.getElementsByClassName('test'))).toBe(false);

    const arr: any = [1, 2];
    if (isArray<string>(arr)) {
      // @ts-expect-error
      arr.push(3);
    }

    if (isArray<number>(arr)) {
      arr.push(3);
    }
  });
  test('isArrayLike', () => {
    expect(isArrayLike([1, 2, 3])).toBe(true);
    expect(isArrayLike(document.getElementsByClassName('test'))).toBe(true);
    expect(isArrayLike(document.querySelectorAll('.test'))).toBe(true);
    expect(isArrayLike([])).toBe(true);
    expect(isArrayLike({ length: 1, 0: 1 })).toBe(true);
    expect(isArrayLike({ length: 2, 0: 1 })).toBe(false);
    expect(isArrayLike('1')).toBe(true);
    expect(isArrayLike(1)).toBe(false);
    expect(isArrayLike(true)).toBe(false);
    expect(isArrayLike(undefined)).toBe(false);
    expect(isArrayLike(null)).toBe(false);
    expect(isArrayLike({})).toBe(false);
    expect(isArrayLike(() => {})).toBe(false);
  });
  test('isString', () => {
    expect(isString(123123)).toBe(false);
    expect(isString('')).toBe(true);
    expect(isString(``)).toBe(true);
  });
  test('isNumber', () => {
    expect(isNumber('')).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber({ 0: 1, 1: 2, length: 2 })).toBe(false);
    expect(isNumber(() => {})).toBe(false);
    expect(isNumber(true)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber([1, 2, 3])).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber(NaN)).toBe(true);
    expect(isNumber(123)).toBe(true);
  });
  test('isFunction', () => {
    expect(isFunction('')).toBe(false);
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
  });

  test('isBoolean', () => {
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean(123123)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean('')).toBe(false);
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean([])).toBe(false);
    expect(isBoolean({})).toBe(false);
  });
  test('isUndefined', () => {
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined(123123)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined([])).toBe(false);
    expect(isUndefined(undefined)).toBe(true);
    let a;
    expect(isUndefined(a)).toBe(true);
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(isUndefined(b)).toBe(true);
    }).toThrow();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(typeof b).toBe('undefined');
  });
  test('isNaN', () => {
    const n = NaN;
    expect(n === n).toBe(false);
    expect(Number.isNaN(n)).toBe(true);
    expect(isNaN(NaN)).toBe(true);
    expect(isNaN({ a: 1 })).toBe(false);
    expect(isNaN(1)).toBe(false);
    expect(isNaN(0)).toBe(false);
    expect(isNaN(-1)).toBe(false);
    expect(isNaN(false)).toBe(false);
    expect(isNaN(undefined)).toBe(false);
    expect(Number.isNaN(undefined)).toBe(false);
    expect(isNaN(null)).toBe(false);
    expect(Number.isNaN(null)).toBe(false);
    expect(isNaN('')).toBe(false);
    expect(isNaN({})).toBe(false);
    expect(isNaN({ a: 1 })).toBe(false);
    expect(isNaN([])).toBe(false);
    expect(Number.isNaN([])).toBe(false);
    expect(isNaN([1, 2, 3])).toBe(false);
    expect(isNaN(['bdsdf', 12323])).toBe(false);
    expect(isNaN('123')).toBe(false);
    expect(isNaN('NaN')).toBe(false);
    expect(Number.isNaN('kfsd')).toBe(false);
    expect(window.isNaN('NaN' as any)).toBe(true);
  });
  test('inTypes', () => {
    expect(inTypes(0, ['string', 'number'])).toBe(true);
    expect(inTypes(0, ['string', 'function', 'object'])).toBe(false);
  });
  test('isPromiseLike', () => {
    expect(isPromiseLike({})).toBe(false);
    expect(isPromiseLike(Promise.resolve())).toBe(true);
    expect(isPromiseLike(null)).toBe(false);
    expect(isPromiseLike(null)).toBe(false);
    expect(isPromiseLike(undefined)).toBe(false);
    expect(isPromiseLike(0)).toBe(false);
    expect(isPromiseLike(-42)).toBe(false);
    expect(isPromiseLike(42)).toBe(false);
    expect(isPromiseLike('')).toBe(false);
    expect(isPromiseLike('then')).toBe(false);
    expect(isPromiseLike(false)).toBe(false);
    expect(isPromiseLike(true)).toBe(false);
    expect(isPromiseLike({})).toBe(false);
    expect(isPromiseLike({ then: true })).toBe(false);
    expect(isPromiseLike([])).toBe(false);
    expect(isPromiseLike([true])).toBe(false);
    expect(isPromiseLike(() => {})).toBe(false);

    const promise = {
      then: () => {},
    };
    expect(isPromiseLike(promise)).toBe(true);
    const fn = () => {};
    fn.then = () => {};
    expect(isPromiseLike(fn)).toBe(true);
  });
  test('isEmptyObject', () => {
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject({ a: 1 })).toBe(false);
    expect(isEmptyObject({ true: 1 })).toBe(false);
    expect(isEmptyObject({ false: 1 })).toBe(false);
    expect(isEmptyObject({ 0: 1 })).toBe(false);
    expect(isEmptyObject({ undefined: 1 })).toBe(false);
    expect(isEmptyObject({ null: 1 })).toBe(false);
    expect(isEmptyObject([])).toBe(false);
    expect(isEmptyObject(function () {})).toBe(false);
  });
  test('isEmpty', () => {
    expect(isEmpty(NaN)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(function () {})).toBe(false);
    expect(
      isEmpty({
        a: function () {},
      }),
    ).toBe(false);
  });

  test('isEqual', () => {
    expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual(1, '1')).toBe(false);
    expect(isEqual(0, '')).toBe(false);
    expect(isEqual(0, false)).toBe(false);
    expect(isEqual(0, null)).toBe(false);
    expect(isEqual(0, undefined)).toBe(false);
    expect(isEqual(null, undefined)).toBe(false);
    expect(isEqual(false, undefined)).toBe(false);
    expect(isEqual(false, null)).toBe(false);
    expect(isEqual(false, true)).toBe(false);
    expect(isEqual([1, 2], { 0: 1, 1: 2, length: 2 })).toBe(false);
    expect(
      isEqual(
        () => {},
        () => {},
      ),
    ).toBe(false);
    expect(isEqual(cm.polling, cm.polling)).toBe(true);
    expect(isEqual([1, 2], [1, 2])).toBe(true);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
    expect(isEqual(false, false)).toBe(true);
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual('', '')).toBe(true);
  });
  test('objectIsEqual', () => {
    const obj = { a: 1 };
    expect(objectIsEqual(obj, obj)).toBe(true);
    expect(objectIsEqual(obj, { a: 1 })).toBe(true);
    expect(objectIsEqual(obj, { a: 2 })).toBe(false);
  });
  test('isSameType', () => {
    expect(isSameType(cm, cm)).toBe(true);
    expect(isSameType(1, 2)).toBe(true);
    expect(isSameType('', new String(123))).toBe(true);
    expect(isSameType(1, NaN)).toBe(true);
    expect(isSameType(1, '')).toBe(false);
    expect(isSameType({}, [])).toBe(false);
    expect(isSameType({}, () => 0)).toBe(false);
    expect(isSameType({}, null)).toBe(false);
  });
  test('isIterable', () => {
    expect(isIterable(null)).toBe(false);
    expect(isIterable(undefined)).toBe(false);
    expect(isIterable(0)).toBe(false);
    expect(isIterable(true)).toBe(false);
    expect(isIterable({})).toBe(false);
    expect(isIterable(Symbol('123'))).toBe(false);
    expect(isIterable('')).toBe(true);
    expect(isIterable([])).toBe(true);
    expect(isIterable([0, 1])).toBe(true);
    expect(isIterable(new Map())).toBe(true);
    expect(isIterable(new Set())).toBe(true);
  });

  test('isPercent', function () {
    expect(isPercent('123$%')).toBe(false);
    expect(isPercent('3%')).toBe(true);
    expect(isPercent('3.0%')).toBe(true);
    expect(isPercent('3.1%')).toBe(true);
    expect(isPercent('100%')).toBe(true);
    expect(isPercent('100%')).toBe(true);
    expect(isPercent('100%1')).toBe(false);
    expect(isPercent('100% ')).toBe(true);
    expect(isPercent('10..0% ')).toBe(false);
    expect(isPercent('10.0.0% ')).toBe(false);
    expect(isPercent('.1% ')).toBe(false);
    expect(isPercent('')).toBe(false);
    expect(isPercent(' ')).toBe(false);
  });
  test('includesChinese', function () {
    expect(includesChinese('哈')).toBe(true);
    expect(includesChinese('哈水电费第三方')).toBe(true);
    expect(includesChinese('哈水电费1第三方')).toBe(true);
    expect(includesChinese('哈水电费.第三方')).toBe(true);
    expect(includesChinese('哈水电费_第三方')).toBe(true);
    expect(includesChinese('哈水电费 第三方')).toBe(true);
    expect(includesChinese('')).toBe(false);
    expect(includesChinese('1231')).toBe(false);
    expect(includesChinese('-=')).toBe(false);
    expect(includesChinese(' ')).toBe(false);
    expect(includesChinese('$$%%')).toBe(false);
  });
  test('isInteger', function () {
    function test(isInteger: typeof Number.isInteger) {
      expect(isInteger(1)).toBe(true);
      expect(isInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(isInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
      expect(isInteger(0)).toBe(true);
      expect(isInteger(-0)).toBe(true);
      expect(isInteger(0.1)).toBe(false);
      expect(isInteger(-0.1)).toBe(false);
      expect(isInteger(-1.1)).toBe(false);
      expect(isInteger(NaN)).toBe(false);
      expect(isInteger(Infinity)).toBe(false);
    }
    test(isInteger);
    test(Number.isInteger);
  });
  test('isArrayObj', function () {
    expect(isArrayObj(Object.assign([1, 2], { b: '1', c: '2' }))).toBe(true);
    expect(isArrayObj([])).toBe(false);
    expect(isArrayObj({ 0: 1, 1: 2, length: 2, a: 1, b: 2 })).toBe(false);
    expect(isArrayObj(document.querySelectorAll('.test'))).toBe(false);
    expect(isArrayObj(document.getElementsByClassName('test'))).toBe(false);
  });
  test('isUnavailable', function () {
    expect(isUnavailable(null)).toBe(true);
    expect(isUnavailable(undefined)).toBe(true);
    expect(isUnavailable(NaN)).toBe(true);
    expect(isUnavailable(1)).toBe(false);
    expect(isUnavailable(0)).toBe(false);
    expect(isUnavailable(false)).toBe(false);
    expect(isUnavailable('')).toBe(false);
  });
  test('isNullish', function () {
    expect(isNullish(null)).toBe(true);
    expect(isNullish(undefined)).toBe(true);
    expect(isNullish(NaN)).toBe(false);
    expect(isNullish(1)).toBe(false);
    expect(isNullish(0)).toBe(false);
    expect(isNullish(false)).toBe(false);
    expect(isNullish('')).toBe(false);
    expect(isNullish({})).toBe(false);
  });
});
