import { sleep, forEachAsync, mapAsync, reduceAsync } from '../../src';

describe('promise', function () {
  test('forEachAsync', async () => {
    const fn = forEachAsync;
    const arr1: number[] = [1, 2, 3];
    await fn(arr1, async (_v, k) => (arr1[k] = k));
    expect(arr1).toEqual([0, 1, 2]);
    // ArrayLike
    await fn({ 0: 1, 1: 2, length: 2 }, async (_v, k) => (arr1[k] = k + k));
    expect(arr1).toEqual([0, 2, 2]);
    // const arr = thisArg || this;
    await fn.call(arr1, arr1, async (_v, k) => (arr1[k] = k + 2));
    expect(arr1).toEqual([2, 3, 4]);
    // if (callbackfn(arr[i], i, arr) === false) break;
    await fn(arr1, async (_v, k) => {
      arr1[k] = k + 1;
      return k !== 1;
    });
    expect(arr1).toEqual([1, 2, 4]);

    const arr2: (number | string)[] = [2, 3, 4];
    await fn(arr2, async (v, k) => (arr2[k] = 'a' + v));
    expect(arr2).toEqual(['a2', 'a3', 'a4']);
    await fn(arr2, async (_v, k) => (arr2[k] = 'a' + k));
    expect(arr2).toEqual(['a0', 'a1', 'a2']);

    const res: any = [];
    const asyncList = [
      async () => {
        await sleep(200);
        res.push(1);
      },
      async () => {
        await sleep(300);
        res.push(2);
      },
      async () => {
        await sleep(10);
        res.push(3);
      },
    ];
    await fn(asyncList, (v: Function) => v());
    expect(res).toEqual([1, 2, 3]);

    const list = [() => Promise.resolve('hello'), () => Promise.reject('im fine')];

    try {
      await fn(list, (v: Function) => v());
    } catch (e) {
      expect(e).toBe('im fine');
    }
  });
  test('mapAsync', async () => {
    const fn = mapAsync;

    const asyncList = [
      async () => {
        await sleep(200);
        return 1;
      },
      async () => {
        await sleep(300);
        return 2;
      },
      async () => {
        await sleep(10);
        return 3;
      },
    ];
    const res = await fn(asyncList, (v) => v());
    expect(res).toEqual([1, 2, 3]);
  });
  test('reduceAsync', async () => {
    expect.assertions(9);

    const fn = reduceAsync;

    const v1 = await fn(
      [
        (v: string) => Promise.resolve(`${v} thank you`),
        (v: string) => Promise.resolve(`${v} im fine`),
      ],
      (initValue, value) => {
        return value(initValue);
      },
      'hello',
    );

    expect(v1).toBe('hello thank you im fine');

    try {
      await fn(
        [
          (v: string) => Promise.resolve(`${v} thank you`),
          (v: string) => Promise.reject(`${v} im fine`),
        ],
        (initValue, value) => {
          return value(initValue);
        },
        'hello',
      );
    } catch (e) {
      expect(e).toBe('hello thank you im fine');
    }

    const v3 = await fn(
      [(v) => `${v} thank you`, (v) => `${v} im fine`] as Array<(v: string) => any>,
      (initValue, value) => {
        return value(initValue);
      },
      'hello',
    );
    expect(v3).toBe('hello thank you im fine');

    const v4 = await fn(
      [() => `thank you`, (v) => `${v} im fine`] as Array<(v: string) => string>,
      (initValue, value) => {
        return value(initValue);
      },
    );
    expect(v4).toBe('thank you im fine');

    const v5 = await fn(
      [async () => `thank you`, async (v) => `${v} im fine`],
      (initValue, value) => {
        return value(initValue);
      },
    );
    expect(v5).toBe('thank you im fine');

    try {
      await fn([], (initValue, value) => {
        return (value as any)(initValue);
      });
    } catch (e: any) {
      expect(e.message).toBe('Reduce of empty array with no initial value');
    }

    const v7 = await fn(
      [],
      (initValue, value) => {
        return (value as any)(initValue);
      },
      'hello',
    );
    expect(v7).toBe('hello');

    // break
    const v8 = await fn(
      [async (v: string) => `${v} thank you`, () => false, async (v: string) => `${v} im fine`],
      (initValue, value) => value(initValue) as any,
      'hello',
    );
    expect(v8).toBe('hello thank you');

    const v9 = await fn(
      [async () => `thank you`, () => false, async (v: string) => `${v} im fine`] as Array<any>,
      async (initValue, value) => value(initValue as string),
    );
    expect(v9).toBe('thank you');
  });
});
