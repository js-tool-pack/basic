import * as cm from '../../src/object/pick';

describe('object.pick', function () {
  function TestExtends(this: any) {
    this.a = 1;
    this.b = 2;
  }

  TestExtends.prototype.c = 3;
  TestExtends.prototype.d = 4;

  const testPickByKeys = (fn: typeof cm.pickByKeys) => {
    return () => {
      const obj = { a: 1, b: '2', c: ['12313', 111], d: false, e: { a: 1 }, f: undefined };
      expect(fn(obj, [])).toEqual({});
      expect(fn(obj, ['a'])).toEqual({ a: 1 });
      expect(fn(obj, ['b'])).toEqual({ b: obj.b });
      expect(fn(obj, ['c'])).toEqual({ c: obj.c });
      expect(fn(obj, ['d'])).toEqual({ d: obj.d });
      expect(fn(obj, ['e'])).toEqual({ e: obj.e });
      expect(fn(obj, ['f'])).toEqual({ f: obj.f });
      expect(fn(obj, ['g' as any])).toEqual({});
      expect(fn(obj, ['a', 'f'])).toEqual({ a: obj.a, f: obj.f });
      expect(fn(obj, ['a', 'f', 'c'])).toEqual({ a: obj.a, f: obj.f, c: obj.c });

      expect(fn(obj, ['a'], (v) => v + 1000)).toEqual({ a: 1001 });
      expect(
        fn(obj, ['a', 'b'], (_v, k) => {
          if (k === 'a') {
            return 2;
          }
          return 'test';
        }),
      ).toEqual({ a: 2, b: 'test' });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(fn(new TestExtends(), ['a', 'c'])).toEqual({ a: 1, c: 3 });

      const a = { a: 1 };
      const b = Object.create(a);
      b.b = 2;
      expect(fn(b, ['a', 'b'])).toEqual({ a: 1, b: 2 });
    };
  };

  test('pickByKeys', () => {
    const fn = cm.pickByKeys;
    testPickByKeys(fn)();
  });
  const testPickRename = (fn: typeof cm.pickRename) => {
    return () => {
      const obj = { a: 1, b: '2', c: ['12313', 111], d: false, e: { a: 1 }, f: undefined };
      expect(fn(obj, {})).toEqual({});
      expect(fn(obj, { A: 'a' })).toEqual({ A: 1 });
      expect(fn(obj, { B: 'b' })).toEqual({ B: obj.b });
      expect(fn(obj, { C: 'c' })).toEqual({ C: obj.c });
      expect(fn(obj, { D: 'd' })).toEqual({ D: obj.d });
      expect(fn(obj, { E: 'e' })).toEqual({ E: obj.e });
      expect(fn(obj, { E: 'f' })).toEqual({ F: obj.f });
      expect(fn(obj, { G: 'G' as any })).toEqual({});
      expect(fn(obj, { A: 'a', F: 'f' })).toEqual({ A: obj.a, F: obj.f });
      expect(fn(obj, { a: 'a', f: 'b', c: 'd' })).toEqual({ a: obj.a, f: obj.b, c: obj.d });

      expect(fn(obj, { A: 'a' }, (v) => v + 1000)).toEqual({ A: 1001 });
      expect(
        fn(obj, { A: 'a', B: 'b' }, (_v, k) => {
          if (k === 'a') {
            return 2;
          }
          return 'test';
        }),
      ).toEqual({ A: 2, B: 'test' });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(fn(new TestExtends(), { aa: 'a', cc: 'c' })).toEqual({ aa: 1, cc: 3 });
    };
  };
  test('pickRename', () => {
    const fn = cm.pickRename;
    testPickRename(fn)();
  });
  test('pick', () => {
    const fn = cm.pick;
    // pickByKeys
    testPickByKeys(fn)();
    let obj = { a: 1, b: '2', c: ['12313', 111], d: false, e: { a: 1 }, f: undefined };
    expect(
      fn(obj, ['a', 'b'], (_v, k) => {
        if (k === 'a') {
          return 2;
        }
        return 'test';
      }),
    ).toEqual({ a: 2, b: 'test' });

    // pickRename
    testPickRename(fn)();
    obj = { a: 1, b: '2', c: ['12313', 111], d: false, e: { a: 1 }, f: undefined };
    expect(
      fn(obj, { A: 'a', B: 'b' }, (_v, k) => {
        if (k === 'a') {
          return 2;
        }
        return 'test';
      }),
    ).toEqual({ A: 2, B: 'test' });
    const nObj = fn(obj, { A: 'a', B: 'a' }, () => {
      return 2;
    });
    expect(nObj).toEqual({ A: 2, B: 2 });
  });
  test('pickUpdated', () => {
    const fn = cm.pickUpdated;
    const obj1 = { a: 12, b: undefined, c: 3 };
    expect(fn(obj1, [{ a: 1 }, { b: 2 }, { d: 3 }])).toEqual({ a: 1, b: 2 });
    expect(fn(obj1, [{ a: 1 }, { a: 2 }, { a: 5 }])).toEqual({ a: 5 });
    expect(fn(obj1, [{ a: 1 }, { a: 2 }, { a: 12 }])).toEqual({});
    expect(fn(obj1, [{ a: 12 }, { b: undefined }, { c: 3 }])).toEqual({});
    expect(fn({}, [{ a: 1 }, { b: 2 }, { d: 3 }])).toEqual({});
    expect(fn({ a: NaN }, [{ a: 1 }, { a: NaN }])).toEqual({});
    expect(fn({ a: NaN }, [{ a: 1 }, null as any])).toEqual({ a: 1 });
    expect(fn({ a: NaN }, [null as any])).toEqual({});
    expect(fn({ a: NaN }, [undefined as any])).toEqual({});
  });
  test('pickDiff', () => {
    const pickDiff = cm.pickDiff;
    expect(pickDiff({ a: 1 }, [])).toEqual({});
    expect(pickDiff({ a: 1 }, [{ a: 1 }])).toEqual({});
    expect(pickDiff({ a: 1 }, [{ a: 2 }])).toEqual({ a: 2 });
    expect(pickDiff({ a: 1 }, [{ b: 2 }])).toEqual({ b: 2 });
    expect(pickDiff({ a: 1 }, [{ b: 2 }, { a: 1, c: 3 }, { a: 3 }])).toEqual({ a: 3, b: 2, c: 3 });
    expect(pickDiff({ a: NaN }, [{ a: NaN, b: 1 }])).toEqual({ b: 1 });

    const a = { a: { id: 123 } };
    const b = { a: { id: 123 } };
    expect(pickDiff(a, [b])).toEqual({ a: { id: 123 } });
    const r = pickDiff(a, [b]);
    expect(r).not.toBe(a);
    expect(r).not.toBe(b);

    expect(
      pickDiff(a, [b], (v1, v2, k, origin, obj) => {
        expect(k in origin).toBeTruthy();
        expect(origin).toBe(a);
        expect(obj).toBe(b);
        return v1.id === v2.id;
      }),
    ).toEqual({});
    expect(
      pickDiff(a, [b, { a: { id: 1 } }, { b: { id: 11 } }], (v1, v2) => {
        return v1 && v1.id === v2.id;
      }),
    ).toEqual({ a: { id: 1 }, b: { id: 11 } });
  });
  test('pickExternal', () => {
    const { pickExternal } = cm;
    expect(pickExternal({ a: 1 }, { a: 2 })).toEqual({});
    expect(pickExternal({ a: 1 }, { b: 2 })).toEqual({ b: 2 });
    expect(pickExternal({ a: 1 }, { b: 2, c: 3 })).toEqual({ b: 2, c: 3 });
    expect(pickExternal({ a: 1, b: 2 }, { b: 2, c: 3 })).toEqual({ c: 3 });
    expect(pickExternal({ a: 1, b: 2 }, { b: 2, c: 3 }, { b: 2, c: 3 })).toEqual({ c: 3 });
  });
});
