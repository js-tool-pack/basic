import * as cm from '../../src/object/path';

describe('object.path', function () {
  test('translateObjPath', () => {
    const fn = cm.translateObjPath;
    expect(fn('a[b][c].d[e][f]')).toBe('a.b.c.d.e.f');
    expect(fn('a.b.c.d.e.f')).toBe('a.b.c.d.e.f');
    expect(fn('a.b.c.d.e.f', 'a')).toBe('b.c.d.e.f');
    expect(fn('a[b][c].d.e.f', 'a\\[b\\]\\[c\\]')).toBe('d.e.f');
    expect(fn('a.b.c.d.e.f', 'a.b.c')).toBe('d.e.f');
    expect(fn('a[][][]')).toBe('a');
    // expect(fn("a%5B%5D", )).toBe("a");
  });
  test('getObjValueByPath', () => {
    const getObjValueByPath = cm.getObjValueByPath;

    const v = getObjValueByPath({ a: { b: { c: 123 } } }, 'a.b.c');
    // object
    expect(v).toBe(123);
    expect(getObjValueByPath({ a: { b: { c: 123 } } }, 'a[b][c]')).toBe(123);
    expect(getObjValueByPath({ a: { b: { c: '123' } } }, 'a[b].c')).toBe('123');

    // array
    expect(getObjValueByPath([[[1]]], '0.0.0')).toBe(1);
    expect(getObjValueByPath([[[1]]], '[0][0][0]')).toBe(1);
    expect(getObjValueByPath([[[1]]], '[0][0].0')).toBe(1);

    expect(getObjValueByPath({ a: { b: { b_c: 123 } } }, 'a[b].b_c')).toBe(123);
    expect(getObjValueByPath({ a: { b: { b_c: 123 } } }, 'a[b][b_c]')).toBe(123);
    expect(getObjValueByPath({ a: { b: { 'b-c': 123 } } }, 'a[b][b-c]')).toBe(123);
    expect(getObjValueByPath({ a: { b: { '123c': 123 } } }, 'a[b][123c]')).toBe(123);
    expect(getObjValueByPath({ a: { '123b': { '123c': 123 } } }, 'a[123b][123c]')).toBe(123);

    expect(getObjValueByPath({ a: { b: { c: [1, 2, 3] } } }, 'a.b.c[2]')).toBe(3);
    expect(getObjValueByPath({ a: { b: { c: [1, 2, 3] } } }, 'a[b][c][2]')).toBe(3);
    expect(getObjValueByPath({ a: { b: { c: [1, 2, 3] } } }, '[a][b][c][2]')).toBe(3);

    expect(getObjValueByPath({ a: { b: { c: 123 } } }, 'a.d.c' as 'a.b.c')).toBe(undefined);
    expect(getObjValueByPath({ a: { b: { c: 123 } } }, 'a[d].c' as any)).toBe(undefined);

    expect(getObjValueByPath({ a: { b: { c: 123 } } }, 'obj[a][b][c]', 'obj')).toBe(123);
  });
  test('setObjValueByPath', () => {
    const fn = cm.setObjValueByPath;
    expect(fn({ a: { b: { c: 123 } } }, 'obj[a][b][c]', 333, undefined, 'obj')).toEqual({
      a: { b: { c: 333 } },
    });
    expect(fn({ a: { b: { c: 123 } } }, 'obj[a][b][c]', true as any, undefined, 'obj')).toEqual({
      a: { b: { c: true } },
    });
    expect(fn({ a: { b: { c: 123 } } }, 'b' as any, true)).toEqual({
      b: true,
      a: { b: { c: 123 } },
    });
    expect(fn({ a: { b: { c: 123 } } }, 'b.c' as any, true)).toEqual({
      b: { c: true },
      a: { b: { c: 123 } },
    });
    expect(fn({ a: 'hello' }, 'a[0]' as any, true)).toEqual({ a: { 0: true } });
    expect(fn({ a: 0 }, 'a[0][b][c]' as any, true)).toEqual({ a: { 0: { b: { c: true } } } });
    expect(fn({ a: 0 }, 'a', true as any, (a, b) => [a, b])).toEqual({ a: [0, true] });
    expect(fn({} as any, 'a', true, (a, b) => [a, b])).toEqual({ a: true });
    expect(fn({ a: '123' }, 'a[3]' as any, 'insert to string')).toEqual({
      a: { 3: 'insert to string' },
    });
    expect(() =>
      fn({ a: '123' }, 'a[3]' as any, 'insert to string', (a, b, isEnd) => (isEnd ? [a, b] : a)),
    ).toThrowError();

    fn({ a: '123' }, 'a[3]' as any, 'i', (_a, _b, _isEnd, path) => {
      expect(path).toBe('a');
      return {};
    });

    function cb(a: any, b: any, _isEnd: any, path: string) {
      expect(path).toBe('a.b.c');
      expect(a).toBe(123);
      expect(b).toBe('test');
      return b;
    }

    expect(fn({ a: { b: { c: 123 } } }, 'obj[a][b][c]' as any, 'test', cb, 'obj')).toEqual({
      a: { b: { c: 'test' } },
    });

    expect(fn({ a: 1 }, 'a[]', 2, (a, b) => [a, b])).toEqual({ a: [1, 2] });

    const obj = {} as any;
    fn(obj, 'a', 1);
    fn(obj, 'a[1]', 2, (a, b, isEnd) => {
      if (isEnd) {
        return b;
      }
      return [a];
    });
    expect(obj).toEqual({ a: [1, 2] });
  });
  test('getObjPathEntries', () => {
    const fn = cm.getObjPathEntries;
    expect(fn({ a: 1 })).toEqual([['[a]', 1]]);
    expect(fn({ a: { b: { c: 123 } } })).toEqual([['[a][b][c]', 123]]);
    expect(fn({ a: { b: { c: 123, d: 111 } } })).toEqual([
      ['[a][b][c]', 123],
      ['[a][b][d]', 111],
    ]);
    expect(fn({ a: { b: [1, 2] } })).toEqual([
      ['[a][b][0]', 1],
      ['[a][b][1]', 2],
    ]);
    expect(fn({ a: { b: [1, 2, { c: 3, cc: 5 }] } })).toEqual([
      ['[a][b][0]', 1],
      ['[a][b][1]', 2],
      ['[a][b][2][c]', 3],
      ['[a][b][2][cc]', 5],
    ]);
    expect(fn({ a: { b: [1, 2, { c: 3, cc: 5 }] } }, 'obj')).toEqual([
      ['obj[a][b][0]', 1],
      ['obj[a][b][1]', 2],
      ['obj[a][b][2][c]', 3],
      ['obj[a][b][2][cc]', 5],
    ]);
  });
  test('revertObjFromPath', () => {
    const fn = cm.revertObjFromPath;
    expect(fn(['a=1', 'b=2'])).toEqual({ a: '1', b: '2' });
    expect(fn(['a=1', 'a=2'])).toEqual({ a: ['1', '2'] });
    expect(fn(['a[0]=1', 'a[1]=2'])).toEqual({ a: ['1', '2'] });
    expect(fn(['a[b]=1', 'a[c]=2'])).toEqual({ a: Object.assign([], { b: '1', c: '2' }) });

    expect(fn(['a.0=1', 'a.1=2'])).toEqual({ a: ['1', '2'] });
    expect(fn(['a.[0]=1', 'a.[1]=2'])).toEqual({ a: ['1', '2'] });
    expect(fn(['a.[b]=1', 'a.[c]=2'])).toEqual({ a: Object.assign([], { b: '1', c: '2' }) });
    expect(fn(['a.[b]=1', 'a.[c]=2'])).not.toEqual({ a: Object.assign([], { b: 1, c: '2' }) });

    expect(fn(['a[]=1', 'a[]=2'])).toEqual({ a: ['1', '2'] });
    // TODO 暂不支持多层路径
    // expect(fn(["a[b][c]=1", "a[b][d]=2"])).toEqual({a: {b: {c: 1, d: 2}}});
  });
});
