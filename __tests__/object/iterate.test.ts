import * as cm from '../../src/object';
import { omit } from '../../src';

describe('object.iterate', function () {
  test('forEachObj', () => {
    const forEachObj = cm.forEachObj;
    const testFn = (obj: object) => {
      let times = 0;
      forEachObj(obj, (v, k) => {
        expect(typeof k).toEqual('string');
        expect(v).toEqual(obj[k]);
        expect(obj).toEqual(obj);
        times++;
      });
      expect(times).toEqual(Object.keys(obj).length);
    };

    testFn({ a: 1, b: '2', c: true });
    testFn({ a: 1, b: '2', c: { test: 1231 } });
    let times = 0;
    const done = forEachObj({ a: 1, b: 2, c: 3 }, () => {
      times++;
      return times == 2 ? false : void 0;
    });
    expect(done).toBeFalsy();
    expect(times).toBe(2);
    expect(forEachObj([], () => {})).toBeTruthy();
    let ec = 0;
    expect(
      forEachObj(
        [1, 2],
        (i) => ((i as number) > 0 ? false : undefined),
        () => (ec = 1),
      ),
    ).toBeFalsy();
    expect(ec).toBe(0);
    expect(
      forEachObj(
        [1, 2],
        () => {},
        () => (ec = 2),
      ),
    ).toBeTruthy();
    expect(ec).toBe(2);

    const obj = { a: 1, b: 2, c: 3 };
    function feo(obj: object) {
      const arr: any[] = [];

      forEachObj(obj, (v, k, obj) => {
        arr.push([v, k, obj]);
      });
      return arr;
    }

    expect(feo(obj)).toEqual(
      Object.keys(obj).reduce((res, key) => {
        res.push([obj[key as keyof typeof obj], key, obj]);
        return res;
      }, [] as any[]),
    );
    expect(feo(obj).length).toBe(3);
    // 不会遍历继承的属性
    expect(feo(Object.create(obj)).length).toBe(0);
  });
  test('reduceObj', () => {
    const reduceObj = cm.reduceObj;
    const obj = { a: 1, b: 2, c: '3' };
    const result = reduceObj(obj, (r, v, k) => ((r[v] = k), r), {} as Record<string, any>);
    expect(result).toEqual({ 1: 'a', 2: 'b', 3: 'c' });
    expect(result === obj).toEqual(false);

    const result2 = reduceObj(
      obj,
      (r, v, k) => {
        r[k] = v + '1';
        return r;
      },
      {} as Record<string, any>,
    );
    const result3 = Object.keys(obj).reduce(
      (r, key) => {
        const v = obj[key as keyof typeof obj];
        r[key] = v + '1';
        return r;
      },
      {} as Record<string, any>,
    );

    expect(result2).toEqual({
      a: '11',
      b: '21',
      c: '31',
    });
    expect(result2).toEqual(result3);
  });

  test('objFilter', () => {
    const fn = cm.filterObj;
    const obj = { a: '', b: 123, c: 0, d: undefined, e: false, f: NaN, g: null };
    expect(fn(obj)).toEqual({ b: 123 });
    expect(fn(obj, (v) => v !== undefined)).toEqual(omit(obj, ['d']));
  });
  test('shadowObj', () => {
    const replaceValues = cm.replaceValues;

    const obj = { a: 1, b: 2 };
    expect(replaceValues(obj, String)).toEqual({ a: '1', b: '2' });
    expect(obj).toEqual({ a: '1', b: '2' });

    const arr = [1, 2, 3];
    expect(replaceValues(arr, String)).toEqual(['1', '2', '3']);
    expect(arr).toEqual(['1', '2', '3']);
    expect(
      replaceValues(arr, (v, k) => {
        expect(typeof k).toBe('string');
        return Number(v);
      }),
    ).toEqual([1, 2, 3]);
  });
});
