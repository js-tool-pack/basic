import * as cm from '../../src/object/common';
import * as arr from '../../src/array';
import { forEachNum } from '../../src';

describe('object', function () {
  test('deepMerge', () => {
    const deepMerge = cm.deepMerge;
    // 对象合并
    const a = { one: 1, two: 2, three: 3 };
    const b = { one: 11, four: 4, five: 5 };
    expect(deepMerge(a, b)).toEqual(Object.assign({}, a, b));

    // 嵌套对象合并
    const c = { ...a, test: { a: 1, b: 2, c: 3 } };
    expect(deepMerge(c, b)).toEqual(Object.assign({}, c, b));
    expect(deepMerge(c, b).test.a === 1).toEqual(true);
    // 第二个对象中不存在属性也会重新复制
    expect(deepMerge(c, b).test !== c.test).toBe(true);

    // 合并类实例
    function Fn(this: any) {
      this.a = 100;
    }

    Fn.prototype.b = 200;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const d = new Fn();
    expect(deepMerge(a, d)).toEqual(Object.assign({}, a, d));
    // 不会合并继承属性
    expect(deepMerge(a, d).b).toEqual(undefined);

    expect(deepMerge(a, { a: [{ b: 123 }] })).toEqual(Object.assign({}, a, { a: [{ b: 123 }] }));
  });

  test('getReversedObj', async () => {
    const fn = cm.getReversedObj;

    const obj = { a: 'aa', b: 'bb' };
    expect(fn(obj)).toEqual({ aa: 'a', bb: 'b' });
  });

  test('omit', () => {
    const omit = cm.omit;
    expect(omit({ a: 12, b: true, c: 'c' }, ['a'])).toEqual({ b: true, c: 'c' });
    expect(omit({ a: 12, b: true, c: 'c' }, ['a', 'b'])).toEqual({ c: 'c' });
    expect(omit({ c: 'c' }, ['c'])).toEqual({});

    const obj: { [k: string]: number } = {};
    forEachNum(10000, (index) => (obj[index] = index));
    const keys = arr.createArray({ len: 500, fill: (v) => String(v) });
    // console.time('run');
    const result = omit(obj, keys);
    expect(Object.keys(result).length).toEqual(9500);
    // console.timeEnd('run');
  });
  test('defaults', () => {
    const defaults = cm.defaults;
    const origin = { a: 12, b: undefined, c: 3, d: null, 0: undefined };
    // 0个参数
    expect(defaults({ ...origin })).toEqual(origin);
    expect(defaults({ ...origin }, null)).toEqual(origin);
    expect(defaults({ ...origin }, 1)).toEqual(origin);
    // 1个参数
    expect(defaults({ ...origin }, { a: 1, b: 1 })).toEqual({ ...origin, b: 1 });
    expect(defaults({ ...origin }, '123')).toEqual({ ...origin, 0: '1', 1: '2', 2: '3' });
    // 2个参数
    expect(defaults({ ...origin }, { a: 1, b: 1 }, { f: 5 })).toEqual({ ...origin, b: 1, f: 5 });
    // 3个参数
    expect(defaults({ ...origin }, { a: 1, b: 1 }, { c: 0, d: 4 }, { f: 5, g: 6 })).toEqual({
      ...origin,
      b: 1,
      f: 5,
      g: 6,
    });
    // 更多
    expect(
      defaults({ ...origin }, { a: 1, b: 1 }, { c: 0, d: 4 }, { f: 5, g: 6 }, { h: 7, i: 8 }),
    ).toEqual({ ...origin, b: 1, f: 5, g: 6, h: 7, i: 8 });
  });
  class UpdateTestSuperClass {
    a = 1;
    b = 2;
    private test() {
      return 'super test';
    }
    fn1() {
      return 'super fn1';
    }
    get len() {
      this.test();
      return 0;
    }
  }
  class UpdateTestClass extends UpdateTestSuperClass {
    c = 3;
    fn2() {
      return 'sub fn2';
    }

    override get len() {
      return 1;
    }
  }
  test('getInsKeys', () => {
    const getInsKeys = cm.getInsKeys;

    const superKeys = ['a', 'b', 'fn1', 'len', 'test'].sort();
    const subKeys = ['c', 'fn2', ...superKeys].sort();

    expect(getInsKeys(new UpdateTestSuperClass()).sort()).toEqual(superKeys);

    expect(getInsKeys(new UpdateTestClass()).sort()).toEqual(subKeys);

    // 不会继承method
    const obj = { a1: 1, b2: 2, c3: 3, ...new UpdateTestClass() };
    expect(getInsKeys(obj).sort()).toEqual(['a', 'b', 'c', 'a1', 'b2', 'c3'].sort());

    const obj2 = Object.create(new UpdateTestClass());
    expect(getInsKeys(obj2).sort()).toEqual(subKeys);

    const obj3 = Object.create(null);
    obj3.a = 1;
    obj3.b = 2;
    expect(getInsKeys(obj3).sort()).toEqual(['a', 'b']);
  });
  const commonUpdate = (fn: Function) => {
    expect(fn({ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { d: 4 })).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
    expect(fn({ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { c: undefined })).toEqual({
      a: 1,
      b: 2,
      c: undefined,
    });
    expect(fn({ a: 12, b: undefined, c: 3 }, { aa: 2, bb: 2, dd: 123 }, { c: undefined })).toEqual({
      a: 12,
      b: undefined,
      c: undefined,
    });

    expect(fn({ a: 12, b: undefined, c: 3 }, null as any, undefined as any)).toEqual({
      a: 12,
      b: undefined,
      c: 3,
    });

    const obj = { a: 1, b: 2 };
    expect(fn(obj, obj)).toBe(obj);
    expect(fn(obj, obj)).toEqual({ a: 1, b: 2 });
  };
  test('updateObj', () => {
    const updateObj = cm.updateObj;
    commonUpdate(updateObj);

    // objUpdate 不会更新实例的方法
    const ins = updateObj(new UpdateTestClass(), {
      fn1() {
        return 'replace fn1';
      },
      fn2() {
        return 'replace fn2';
      },
    });
    expect(ins.fn1()).toBe('super fn1');
    expect(ins.fn2()).toBe('sub fn2');
  });
  test('updateIns', () => {
    const fn = cm.updateIns;
    commonUpdate(fn);

    // updateIns 会更新实例的方法
    const ins = fn(new UpdateTestClass(), {
      fn1() {
        return 'replace fn1';
      },
      fn2() {
        return 'replace fn2';
      },
    });
    expect(ins.fn1()).toBe('replace fn1');
    expect(ins.fn2()).toBe('replace fn2');
  });

  test('renameObjKey', () => {
    const renameObjKey = cm.renameObjKey;
    expect(renameObjKey({ a: 12, b: undefined, c: 3 }, { test: 'a', bb: 'b' })).toEqual({
      test: 12,
      bb: undefined,
      c: 3,
    });
    expect(renameObjKey({ a: 12, b: undefined, c: 3 }, { test: 'aa' as any, bb: 'b' })).toEqual({
      a: 12,
      bb: undefined,
      c: 3,
    });
    expect(renameObjKey({ a: 1, b: 2 }, { a: 'a', aa: 'a', aaa: 'a' })).toEqual({
      a: 1,
      aa: 1,
      aaa: 1,
      b: 2,
    });
  });

  test('hasOwn', () => {
    const fn = cm.hasOwn;

    const obj = { a: 1, b: 2 } as const;

    expect(fn(obj, 'a')).toBeTruthy();
    expect(fn(obj, 'c')).toBeFalsy();

    const obj2 = Object.create(obj);
    obj2.a = 3;

    expect(fn(obj2, 'a')).toBeTruthy();
    expect(fn(obj2, 'b')).toBeFalsy();
  });

  test('swap', () => {
    const swap = cm.swap;

    // 对象属性交换
    expect(swap({ a: 1, b: 2 }, 'a', 'b')).toEqual({ b: 1, a: 2 });
    expect(swap({ a: 1, b: 2 }, 'a', 'c' as any)).toEqual({ c: 1, b: 2, a: undefined });

    // 数组item交换
    expect(swap([1, 2], 1, 0)).toEqual([2, 1]);
    expect(swap([1, 2], 1, 2)).toEqual([1, undefined, 2]);
  });

  test('likeKeys', () => {
    const likeKeys = cm.likeKeys;
    expect(likeKeys([1, 2, 3, 4, 5, 6, 7], '0')).toEqual(['0']);
    expect(likeKeys([1, 2, 3, 4, 5, 6, 7, 1, 1, 1, 1, 1, 1], '0')).toEqual(['0', '10']);
    expect(likeKeys({ test: 1, test2: 2, test3: 3 }, 'test')).toEqual(['test', 'test2', 'test3']);
    const map = new Map<string, number | string>([
      ['aa', 1],
      ['bb', 2],
      ['hello', 'world'],
    ]);
    expect(likeKeys(map, /a+|b+/)).toEqual(['aa', 'bb']);
  });
});
