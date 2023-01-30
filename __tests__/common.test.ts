import * as cm from '../src/common';
import { sleep } from '../src/promise';
import { avg } from '../src';
import { inRange } from '@mxssfd/core';

describe('common', function () {
  test('debounce', async () => {
    expect.assertions(4);
    const debounce = cm.debounce;

    let times = 0;
    const wrapFn = debounce(() => times++, 100);
    wrapFn();
    expect(times).toBe(0);
    // 立即执行上一次的防抖函数
    wrapFn.flush();
    expect(times).toBe(1);
    wrapFn();
    // 取消上一次的防抖
    wrapFn.cancel();
    await sleep(110);
    expect(times).toBe(1);

    await sleep(300);
    setTimeout(wrapFn, 10);
    setTimeout(wrapFn, 20);
    setTimeout(wrapFn, 30);
    setTimeout(wrapFn, 40);
    setTimeout(() => {
      expect(times).toBe(2);
      // 异步代码需要调用done()
    }, 500);
    await sleep(500);
  });
  test('debounce immediate', async () => {
    expect.assertions(4);
    let times = 0;
    const d = cm.debounce(() => times++, 100, true);
    d();
    expect(times).toBe(1);
    d.flush();
    expect(times).toBe(2);
    d();
    d.cancel();
    await sleep(500);
    setTimeout(d, 10);
    setTimeout(d, 20);
    setTimeout(d, 30);
    setTimeout(d, 40);
    setTimeout(() => {
      expect(times).toBe(3);
    }, 500);
    await sleep(1000);
    times = 0;
    d();
    setTimeout(() => {
      expect(times).toBe(1);
      // 异步代码需要调用done()
    }, 500);
    await sleep(500);
  });

  test('oneByOne', async () => {
    const s = 'hello world';
    const receive: string[] = [];
    const diff: number[] = [];
    let lastNow = Date.now();
    const { promise } = cm.oneByOne(s, 10, (w) => {
      receive.push(w);
      const now = Date.now();
      diff.push(now - lastNow);
      lastNow = now;
    });
    await promise;
    expect(receive).toEqual(s.split(''));
    // 此处应该是0，但是整体测试的时候总是差那么一两毫秒
    // expect(diff[0]).toBe(0);
    expect(inRange(diff[0]!, [0, 2])).toBe(true);
    const _avg = avg(diff.slice(1));
    // 虽然是间隔10秒，但由于js的setTimeout并不精准，所以会有波动
    expect(10 <= _avg && _avg <= 11).toBe(true);
    await cm.oneByOne(s, 10).promise;
  });
  test('functionApply', () => {
    // const args = [1, 2, 3];
    // (new Function(generateFunctionCode(args.length)))(object, property, args);
    expect('123'.padStart(6, '0')).toBe('000123');
    const value = cm.functionApply(
      { strPadStart: (s: string, count: number, pad: string) => s.padStart(count, pad) },
      'strPadStart',
      ['123', 6, '0'],
    );
    expect(value).toBe('000123');
  });
  test('polling', async () => {
    let t = 0;

    let { cancel, promise } = cm.polling((times) => {
      t = times;
      if (times === 10) cancel();
    }, 10);
    await promise;
    expect(t).toBe(10);

    t = 0;

    ({ cancel, promise } = cm.polling(
      (times) => {
        return new Promise<void>((res) => {
          t++;
          expect(times).toBe(t);
          if (times === 10) {
            cancel();
          }
          res();
        });
      },
      10,
      false,
    ));
    await promise;
    expect(t).toBe(10);
  });

  test('createUUID', () => {
    const uuid = cm.createUUID();

    // 判断长度是否正确
    expect(uuid.length).toBe('xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxx'.length);

    const hexDigits = '0123456789abcdef-';
    // 判断每个字符是否在范围内
    for (let i = 0; i < uuid.length; i++) {
      expect(hexDigits.includes(uuid[i]!)).toBeTruthy();
    }

    // 判断100次循环中是否有相同的
    for (let i = 0; i < 100; i++) {
      const uid = cm.createUUID();
      expect(uid !== uuid).toBeTruthy();
    }
  });
  test('createEnum', async () => {
    const createEnum = cm.createEnum;

    // object
    expect(createEnum({ a: 'aa', b: 'bb' })).toEqual({ a: 'aa', b: 'bb', aa: 'a', bb: 'b' });
    expect(createEnum({ a: 1, b: 2 })).toEqual({ a: 1, b: 2, 1: 'a', 2: 'b' });

    // array
    expect(createEnum([0, 1])).toEqual({ '0': '0', '1': '1' });
    expect(createEnum(['a', 'b'])).toEqual({ a: '0', b: '1', 0: 'a', 1: 'b' });
  });

  test('throttle', async () => {
    expect.assertions(33);
    const throttle = cm.throttle;
    let times = 0;
    let invalidTimes = 0;
    let interval = 0;
    const th = throttle(
      () => {
        interval = 0;
        return times++;
      },
      1000,
      {
        invalidCB: (int) => {
          interval = int;
          invalidTimes++;
        },
      },
    );

    const now = Date.now();
    await new Promise<void>((resolve) => {
      // TODO 可以使用OneByOne代替
      th();

      function exec() {
        const index = setTimeout(() => {
          const t = th();
          expect(t).toBe(t === undefined ? undefined : times - 1);
          if (Date.now() - now > 2200) {
            clearInterval(index);
            resolve();
            return;
          }
          exec();
        }, 100);
      }

      exec();
    });
    expect(times).toBe(3);
    // 有些电脑能够执行20次 与定时器有关 实际并不准确
    expect(invalidTimes).toBeGreaterThanOrEqual(15);
    expect(invalidTimes).toBeLessThanOrEqual(20);

    // interval = 0;
    await sleep(1000);
    th();
    expect(interval).toBe(0);
    await sleep(100);
    th();
    expect(interval).toBeLessThanOrEqual(900);
    expect(interval).toBeGreaterThanOrEqual(800);
    await sleep(200);
    th();
    expect(interval).toBeLessThanOrEqual(700);
    expect(interval).toBeGreaterThanOrEqual(600);
    await sleep(701);
    th();
    expect(interval).toBe(0);

    let times2 = 0;
    let interval2 = 0;
    const th2 = throttle(() => {
      interval2 = 3;
      return times2++;
    }, 1000);
    th2();
    th2();
    th2();
    th2();
    expect(interval2).toBe(3);
    expect(times2).toBe(1);
  });
  test('throttle.leading', async () => {
    let fn = jest.fn();

    // immediate
    let wrapFn = cm.throttle(fn, 100, { leading: false });
    // 初始时时0次
    expect(fn.mock.calls.length).toBe(0);
    // 执行一次
    wrapFn();
    // 由于节流包裹函数时就开启了节流，此时还在时间内，所以内部不执行
    expect(fn.mock.calls.length).toBe(0);
    await sleep(120);
    // 上一次执行的被丢弃了
    expect(fn.mock.calls.length).toBe(0);
    // 在间隔期外执行
    wrapFn();
    // 此时成功执行
    expect(fn.mock.calls.length).toBe(1);

    fn = jest.fn();
    // 立即执行
    wrapFn = cm.throttle(fn, 100, { leading: true });
    expect(fn.mock.calls.length).toBe(0);
    wrapFn();
    // 由于节流包裹时未开启计时，所以
    expect(fn.mock.calls.length).toBe(1);
  });
  test('throttle.trailing', async () => {
    const fn = jest.fn();

    // trailing
    const wrapFn = cm.throttle(fn, 100, { leading: false, trailing: true });
    // 初始时时0次
    expect(fn.mock.calls.length).toBe(0);
    // 执行一次
    wrapFn(1);
    wrapFn(2);
    wrapFn(3);
    // 由于节流包裹函数时就开启了节流，此时还在时间内，所以内部不执行
    expect(fn.mock.calls.length).toBe(0);
    await sleep(120);
    // 上一次执行的不会被丢弃
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(3);
  });
  test('throttle.invalidCB', async () => {
    const fn = jest.fn();
    const invFn = jest.fn();
    // invalidCB
    const wrapFn = cm.throttle(fn, 100, { leading: false, invalidCB: invFn });
    // 初始时时0次
    expect(fn.mock.calls.length).toBe(0);
    // 执行一次
    wrapFn();
    wrapFn();
    wrapFn();
    // 由于节流包裹函数时就开启了节流，此时还在时间内，所以内部不执行
    expect(fn.mock.calls.length).toBe(0);
    await sleep(120);
    // 上一次执行的会被丢弃
    expect(fn.mock.calls.length).toBe(0);

    expect(invFn.mock.calls.length).toBe(3);
  });
  /*test("throttleByTimeDown", async () => {
    // expect.assertions(4);
    const fn = cm.throttleByTimeDown;
    let times = 0;
    let invalidTimes = 0;
    let interval = 0;
    const th = fn(() => {
        interval = 0;
        return times++;
    }, 1000, (int) => {
        interval = int;
        invalidTimes++;
    });

    const now = Date.now();
    await new Promise<void>(((resolve, reject) => {
        // TODO 可以使用OneByOne代替
        th();

        function exec() {
            const index = setTimeout(() => {
                const t = th();
                expect(t).toBe(t === undefined ? undefined : times - 1);
                if (Date.now() - now > 2200) {
                    clearInterval(index);
                    resolve();
                    return;
                }
                exec();
            }, 100);
        }

        exec();
    }));
    expect(times).toBe(3);
    // 有些电脑能够执行20次 与定时器有关 实际并不准确
    expect(invalidTimes).toBeGreaterThanOrEqual(15);
    expect(invalidTimes).toBeLessThanOrEqual(20);

    // interval = 0;
    await sleep(1000);
    th();
    expect(interval).toBe(0);
    await sleep(100);
    th();
    expect(interval).toBeLessThanOrEqual(900);
    expect(interval).toBeGreaterThanOrEqual(800);
    await sleep(200);
    th();
    expect(interval).toBeLessThanOrEqual(700);
    expect(interval).toBeGreaterThanOrEqual(600);
    await sleep(701);
    th();
    expect(interval).toBe(0);
});*/
  test('getRoot', () => {
    // Function
    expect(cm.getRoot()).toBe(window);
    const origin = {
      fn: Function,
    };

    // 禁止Function
    // eslint-disable-next-line no-global-assign
    Function = jest.fn(() => {
      throw new Error('');
    });

    // globalThis
    expect(cm.getRoot()).toBe(globalThis);

    // eslint-disable-next-line no-global-assign
    Function = origin.fn;
  });

  test('parseCmdParams', () => {
    const parseCmdParams = cm.parseCmdParams;

    function pcp(value: string, prefix?: string, df?: string) {
      return Object.fromEntries(parseCmdParams(value.split(' ').slice(2), prefix, df));
    }

    expect(pcp('node test.js test.js -a -b -c')).toEqual({
      default: 'test.js',
      a: true,
      b: true,
      c: true,
    });

    expect(pcp('node test.js test.js -a=123')).toEqual({ default: 'test.js', a: '123' });

    expect(pcp('node test.js test.js -a=123 333 555 -b 666 888 -c=1 -b=999')).toEqual({
      default: 'test.js',
      a: ['123', '333', '555'],
      b: ['666', '888', '999'],
      c: '1',
    });

    expect(pcp('node test.js test.js -a=123=333=444=555')).toEqual({
      default: 'test.js',
      a: '123=333=444=555',
    });

    expect(pcp('node test.js test.js -a= ')).toEqual({ default: 'test.js', a: true });

    expect(pcp('node test.js test.js -a= -b=123')).toEqual({
      default: 'test.js',
      a: true,
      b: '123',
    });

    expect(pcp('node test.js test.js -a==123=333=444=555')).toEqual({
      default: 'test.js',
      a: '=123=333=444=555',
    });

    expect(pcp('node test.js test.js --a==123=333=444=555', '--', 'args')).toEqual({
      args: 'test.js',
      a: '=123=333=444=555',
    });
  });
});
