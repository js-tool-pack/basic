import { sleep, inRange } from '../src';
import * as cm from '../src/promise';

describe('promise', function () {
  jest.useRealTimers();
  test('sleep', async () => {
    // jest在useFakeTimers和Promise之间有bug
    // useRealTimers又不够精准
    const now = Date.now();
    await sleep(100);
    expect(Date.now() - now).toBeGreaterThanOrEqual(50);
    expect(Date.now() - now).toBeLessThanOrEqual(150);
  });
  describe('lazy', () => {
    const fn = cm.lazy;
    test('base', async () => {
      const mock = jest.fn();

      const start = Date.now();
      let end = 0;
      fn()
        .do((done) => (mock('hello'), done()))
        .wait(10)
        .do(
          () =>
            new Promise<void>((res) => {
              mock('hello');
              res();
            }),
        )
        .wait(20)
        .do((done) => {
          mock('world');
          end = Date.now();
          done();
        });
      await sleep(50);
      expect(mock.mock.calls.length).toBe(3);
      expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello', 'hello', 'world']);
      expect(end - start).toBeGreaterThanOrEqual(30);
    });
    test('promise中断', async () => {
      const mock = jest.fn();

      fn()
        .wait(10)
        .do(
          () =>
            new Promise(() => {
              // promise不resolve，那么后面的永远不会执行
              mock('hello');
            }),
        )
        .wait(20)
        .do((done) => {
          mock('world');
          done();
        });
      await sleep(50);
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello']);
    });
    test('done中断', async () => {
      const mock = jest.fn();

      fn()
        .wait(10)
        // 不done的话，后面的永远不会执行
        .do(() => mock('hello'))
        .wait(20)
        .do((done) => {
          mock('world');
          done();
        });
      await sleep(50);
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello']);
    });
    test('value chain', async () => {
      const mock = jest.fn();

      fn()
        .wait(10)
        .do((done) => done('hello '))
        .wait(20)
        .do((done, value) => done(value + 'world'))
        .do((_, value) => Promise.resolve(value + ' foo bar'))
        .do((done, value) => {
          mock(value);
          done();
        })
        .do((_, value) => mock(value));
      await sleep(50);
      expect(mock.mock.calls.length).toBe(2);
      expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello world foo bar', undefined]);
    });
  });

  test('promiseQueue', async () => {
    const promiseQueue = cm.promiseQueue;
    const v = await promiseQueue(
      [(v) => Promise.resolve(`${v} thank you`), (v) => Promise.resolve(`${v} im fine`)],
      'hello',
    );
    expect(v).toBe('hello thank you im fine');

    try {
      await promiseQueue(
        [(v) => Promise.resolve(`${v} thank you`), (v) => Promise.reject(`${v} im fine`)],
        'hello',
      );
    } catch (e) {
      expect(e).toBe('hello thank you im fine');
    }

    const v2 = await promiseQueue(
      [(v: any) => `${v} thank you`, (v: any) => `${v} im fine`] as any,
      'hello',
    );
    expect(v2).toBe('hello thank you im fine');
  });
  test('syncPromiseAll', async () => {
    const syncPromiseAll = cm.syncPromiseAll;

    let timeStart = Date.now();
    let timeEnd = timeStart;
    let num = 0;
    const list = [
      () =>
        new Promise<number>((res) => {
          setTimeout(() => {
            timeEnd = Date.now();
            num = 200;
            res(200);
          }, 200);
        }),
      () => ((num = 2), Promise.resolve(2)),
    ];
    const res = await syncPromiseAll(list);

    expect(inRange(timeEnd - timeStart, [200, 300])).toBe(true);
    expect(res).toEqual([200, 2]);
    expect(num).toBe(2);

    // 对比Promise.all, 是先执行的快的那一个
    timeStart = Date.now();
    const res2 = await Promise.all(list.map((i) => i()));
    expect(timeEnd - timeStart).toBeGreaterThanOrEqual(200);
    expect(timeEnd - timeStart).toBeLessThanOrEqual(300);
    expect(res2).toEqual([200, 2]);
    expect(num).toBe(200);
  });
  test('debounceAsync', async () => {
    expect.assertions(2);
    const debounceAsync = cm.debounceAsync;
    let times = 0;

    const dbFn = debounceAsync(() => {
      return new Promise((resolve) => {
        resolve(times++);
      });
    }, 100);

    await Promise.allSettled([dbFn(), dbFn(), dbFn(), dbFn()]);

    expect(times).toEqual(1);

    dbFn();
    await sleep(150);
    dbFn();
    await sleep(150);
    expect(times).toEqual(3);
  });
  test('debounceByPromise', async () => {
    expect.assertions(2);
    const debounceByPromise = cm.debounceByPromise;
    let times = 0;

    const dbFn = debounceByPromise((time = 50) => {
      const p = new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(time);
        }, time);
      });
      p.then(() => {
        times++;
      });
      return p;
    });

    const res = await Promise.any([dbFn(40), dbFn(20), dbFn(60), dbFn(30)]);
    expect(res).toEqual(30);

    dbFn(100);
    await sleep(150);
    dbFn();
    await sleep(150);
    // fix me 执行了6次， debounceByPromise无法阻止cb被调用 不推荐使用
    expect(times).toEqual(6);
  });

  describe('lazy', () => {
    const lazy = cm.lazy;
    test('base', async () => {
      const mock = jest.fn();

      const start = Date.now();
      let end = 0;
      lazy()
        .do((done) => (mock('hello'), done()))
        .wait(10)
        .do(
          () =>
            new Promise<void>((res) => {
              mock('hello');
              res();
            }),
        )
        .wait(20)
        .do((done) => {
          mock('world');
          end = Date.now();
          done();
        });
      await sleep(50);
      expect(mock.mock.calls.length).toBe(3);
      expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello', 'hello', 'world']);
      expect(end - start).toBeGreaterThanOrEqual(30);
    });
    test('promise中断', async () => {
      const mock = jest.fn();

      lazy()
        .wait(10)
        .do(
          () =>
            new Promise(() => {
              // promise不resolve，那么后面的永远不会执行
              mock('hello');
            }),
        )
        .wait(20)
        .do((done) => {
          mock('world');
          done();
        });
      await sleep(50);
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello']);
    });
    test('done中断', async () => {
      const mock = jest.fn();

      lazy()
        .wait(10)
        // 不done的话，后面的永远不会执行
        .do(() => mock('hello'))
        .wait(20)
        .do((done) => {
          mock('world');
          done();
        });
      await sleep(50);
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello']);
    });
    test('value chain', async () => {
      const mock = jest.fn();

      lazy()
        .wait(10)
        .do((done) => done('hello '))
        .wait(20)
        .do((done, value) => done(value + 'world'))
        .do((_, value) => Promise.resolve(value + ' foo bar'))
        .do((done, value) => {
          mock(value);
          done();
        })
        .do((_, value) => mock(value));
      await sleep(50);
      expect(mock.mock.calls.length).toBe(2);
      expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello world foo bar', undefined]);
    });
  });
  test('nextTick', async () => {
    const nextTick = cm.nextTick;
    const fn = jest.fn();

    expect(fn.mock.calls.length).toBe(0);
    await nextTick().then(fn);
    expect(fn.mock.calls.length).toBe(1);

    nextTick(fn);
    await sleep(0);
    expect(fn.mock.calls.length).toBe(2);

    // 中断
    const abort = nextTick(fn);
    abort();
    await sleep(0);
    expect(fn.mock.calls.length).toBe(2);
  });
});
