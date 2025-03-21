import { inRange, sleep, avg } from '../src';
import * as cm from '../src/common';

describe('common', function () {
  jest.useFakeTimers();

  describe('debounce', function () {
    const debounce = cm.debounce;
    test('common', async () => {
      expect.assertions(4);

      let times = 0;
      const wrapFn = debounce(() => times++, 100);
      wrapFn();
      expect(times).toBe(0);
      // 立即执行上一次的防抖函数
      // 此次 flush 执行的是 leading 的尾调用，leading 不会消除定时器
      wrapFn.flush();
      expect(times).toBe(1);
      wrapFn();
      // 取消上一次的防抖，并重置leading
      wrapFn.cancel();
      jest.advanceTimersByTime(110);
      expect(times).toBe(1);

      jest.advanceTimersByTime(300);
      setTimeout(wrapFn, 10);
      setTimeout(wrapFn, 20);
      setTimeout(wrapFn, 30);
      setTimeout(wrapFn, 40);
      setTimeout(() => {
        expect(times).toBe(2);
        // 异步代码需要调用done()
      }, 500);
      jest.advanceTimersByTime(500);
    });
    describe('rules', function () {
      describe('开启了 leading 首调用，那么 debounce 生效一次，会执行两次', () => {
        it('未开启 leading,只会执行一次尾调用', async () => {
          let times = 0;
          const fn = debounce(() => times++, 10);
          fn();
          expect(times).toBe(0);
          jest.advanceTimersByTime(30);
          expect(times).toBe(1);
        });
        it('开启 leading，会执行一次首尾调用', async () => {
          let times = 0;
          const fn = debounce(() => times++, 10, true);
          fn();
          // leading 首调用已经执行了
          expect(times).toBe(1);
          jest.advanceTimersByTime(30);
          // 已经执行了尾调用
          expect(times).toBe(2);
        });
      });
      describe('如果是多次执行 debounce 函数，在 debounce 生效期间会返回上一次执行的结果', function () {
        test('leading:false', () => {
          const fn = debounce((v: number) => 10 + v, 20);
          expect(fn(1)).toBe(undefined);
          expect(fn(2)).toBe(undefined);
          expect(fn(3)).toBe(undefined);
          fn.cancel();
        });
        test('leading:true', () => {
          const fn = debounce((v: number) => 10 + v, 20, true);
          expect(fn(1)).toBe(11);
          expect(fn(2)).toBe(11);
          expect(fn(3)).toBe(11);
          fn.cancel();
        });
      });
      it('手动取消成功时，下一次 leading 一定可以执行', async () => {
        const fn = debounce((v: number) => 100 + v, 20, true);

        expect(fn(1)).toBe(101);
        expect(fn(2)).toBe(101);
        expect(fn(3)).toBe(101);

        fn.cancel();
        expect(fn(11)).toBe(111);
      });
      it('手动 flush 时，取消定时器，也就是取消当前的尾调用', async () => {
        let times = 0;
        const fn = debounce(() => ++times, 10);
        fn();
        expect(times).toBe(0);
        expect(fn.flush()).toBe(1);
        expect(times).toBe(1);
        jest.advanceTimersByTime(30);
        expect(times).toBe(1);
      });
      it('如果手动 flush 最近一次调用 debounce 时已经成功执行过了，那么直接返回上一次的结果', async () => {
        let val = 0;
        const fn = debounce((v: number) => (val = v), 1, true);
        fn(1);
        expect(val).toBe(1);
        fn(2);
        fn(3);
        expect(val).toBe(1);
        jest.advanceTimersByTime(20);
        expect(val).toBe(3);
        expect(fn.flush()).toBe(3);
      });
    });
    test('leading', () => {
      expect.assertions(4);
      let times = 0;
      const fn = debounce(() => times++, 100, true);
      // leading 生效 times++ 1
      fn();
      expect(times).toBe(1);
      // 手动 flush，并重置 leading， times++  2
      // 执行的是 leading 的尾调用
      fn.flush();
      expect(times).toBe(2);
      // leading 重新生效 times++ 3
      fn();
      // 取消上一次的防抖，并重置leading
      fn.cancel();
      jest.advanceTimersByTime(500);
      // leading 重新生效 times++ 4
      setTimeout(fn, 10);
      setTimeout(fn, 20);
      setTimeout(fn, 30);
      // 尾调用 times++  5
      setTimeout(fn, 40);
      setTimeout(() => {
        expect(times).toBe(5);
      }, 500);
      jest.advanceTimersByTime(1000);
      times = 0;
      fn();
      setTimeout(() => {
        // 首尾调用 times == 2
        expect(times).toBe(2);
        // 异步代码需要调用done()
      }, 500);
      jest.advanceTimersByTime(500);
    });
  });

  test('oneByOne', () => {
    const s = 'hello world';
    const receive: string[] = [];
    const diff: number[] = [];
    let lastNow = Date.now();
    /*const { promise } = */ cm.oneByOne(s, 10, (w) => {
      receive.push(w);
      const now = Date.now();
      diff.push(now - lastNow);
      lastNow = now;
    });
    // await promise;
    jest.advanceTimersByTime(100);
    expect(receive).toEqual(s.split(''));
    // 此处应该是0，但是整体测试的时候总是差那么一两毫秒
    expect(diff[0]).toBe(0);
    expect(inRange(diff[0]!, [0, 2])).toBe(true);
    const _avg = avg(diff.slice(1));
    // 虽然是间隔10秒，但由于js的setTimeout并不精准，所以会有波动
    expect(10 <= _avg && _avg <= 11).toBe(true);
    // await cm.oneByOne(s, 10).promise;
    cm.oneByOne(s, 10);
    // jest.advanceTimersByTime(100);
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

    let { promise, cancel } = cm.polling((times) => {
      t = times;
      if (times === 10) cancel();
    }, 10);
    // await promise;
    jest.advanceTimersByTime(90);
    expect(t).toBe(10);

    t = 0;

    jest.useRealTimers();
    ({ promise, cancel } = cm.polling(
      (times) => {
        return new Promise<void>((res) => {
          t++;
          expect(times).toBe(t);
          if (times === 10) cancel();
          res();
        });
      },
      10,
      false,
    ));
    await promise;
    expect(t).toBe(10);
    jest.useFakeTimers();
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
    expect(createEnum({ a: 1, b: 2 })).toEqual({ 1: 'a', 2: 'b', a: 1, b: 2 });

    // array
    expect(createEnum([0, 1])).toEqual({ '0': '0', '1': '1' });
    expect(createEnum(['a', 'b'])).toEqual({ a: '0', b: '1', 0: 'a', 1: 'b' });
  });

  test('throttle', async () => {
    // expect.assertions(33);
    const throttle = cm.throttle;

    const fn = jest.fn();
    const cb = throttle((value: number) => fn(value), 1, { leading: true });
    cb(1);
    expect(fn).toHaveBeenCalled();
    expect(fn.mock.calls).toEqual([[1]]);

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
    // await new Promise<void>((resolve) => {
    new Promise<void>((resolve) => {
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
    jest.advanceTimersByTime(2231);
    expect(times).toBe(3);
    // 有些电脑能够执行20次 与定时器有关 实际并不准确
    expect(invalidTimes).toBeGreaterThanOrEqual(15);
    expect(invalidTimes).toBeLessThanOrEqual(20);

    // interval = 0;
    jest.advanceTimersByTime(1000);
    th();
    expect(interval).toBe(0);
    jest.advanceTimersByTime(100);
    th();
    expect(interval).toBeLessThanOrEqual(900);
    expect(interval).toBeGreaterThanOrEqual(800);
    jest.advanceTimersByTime(200);
    th();
    expect(interval).toBeLessThanOrEqual(700);
    expect(interval).toBeGreaterThanOrEqual(600);
    jest.advanceTimersByTime(701);
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
    jest.advanceTimersByTime(120);
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
    jest.advanceTimersByTime(120);
    // 上一次执行的不会被丢弃
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(3);
  });
  test('throttle.invalidCB', async () => {
    const fn = jest.fn();
    const invFn = jest.fn();
    // invalidCB
    const wrapFn = cm.throttle(fn, 100, { invalidCB: invFn, leading: false });
    // 初始时时0次
    expect(fn.mock.calls.length).toBe(0);
    // 执行一次
    wrapFn();
    wrapFn();
    wrapFn();
    // 由于节流包裹函数时就开启了节流，此时还在时间内，所以内部不执行
    expect(fn.mock.calls.length).toBe(0);
    jest.advanceTimersByTime(120);
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

    Function = jest.fn(() => {
      throw new Error('');
    });

    // globalThis
    expect(cm.getRoot()).toBe(globalThis);

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
      a: ['123', '333', '555'],
      b: ['666', '888', '999'],
      default: 'test.js',
      c: '1',
    });

    expect(pcp('node test.js test.js -a=123=333=444=555')).toEqual({
      a: '123=333=444=555',
      default: 'test.js',
    });

    expect(pcp('node test.js test.js -a= ')).toEqual({ default: 'test.js', a: true });

    expect(pcp('node test.js test.js -a= -b=123')).toEqual({
      default: 'test.js',
      b: '123',
      a: true,
    });

    expect(pcp('node test.js test.js -a==123=333=444=555')).toEqual({
      a: '=123=333=444=555',
      default: 'test.js',
    });

    expect(pcp('node test.js test.js --a==123=333=444=555', '--', 'args')).toEqual({
      a: '=123=333=444=555',
      args: 'test.js',
    });
  });

  test('loadingElse', async () => {
    jest.useRealTimers();
    const loadingElse = cm.loadingElse;

    const fn = jest.fn();
    const cb = loadingElse(fn);

    cb();
    cb();
    cb();
    cb();
    cb();

    expect(fn.mock.calls.length).toBe(5);

    fn.mock.calls.length = 0;

    const cb2 = loadingElse(() => sleep(10).then(fn));
    cb2();
    cb2();
    cb2();
    cb2();
    cb2();

    await sleep(20);
    expect(fn.mock.calls.length).toBe(1);
  });
  describe('createEventBus', () => {
    test('base', () => {
      const eventBus = cm.createEventBus<number>();
      const listener = jest.fn();
      eventBus.on(listener);

      expect(listener).not.toBeCalled();

      eventBus.emit(1);
      expect(listener).toBeCalled();
      expect(listener.mock.calls[0].length).toBe(2);
      expect(listener.mock.calls[0][0]).toBe(1);
      expect(typeof listener.mock.calls[0][1]).toBe('function');
    });
    test('off', () => {
      const eventBus = cm.createEventBus<number>();
      const listener = jest.fn();
      const listener2 = jest.fn((_, off) => off()) as typeof listener;
      const off = eventBus.on(listener);
      eventBus.on(listener2);

      expect(listener).not.toBeCalled();
      expect(listener2).not.toBeCalled();

      eventBus.emit(1);
      expect(listener.mock.calls[0][0]).toBe(1);
      expect(listener2.mock.calls[0][0]).toBe(1);

      listener.mockClear();
      listener2.mockClear();
      eventBus.emit(2);
      expect(listener.mock.calls[0][0]).toBe(2);
      expect(listener2).not.toBeCalled();

      listener.mockClear();
      listener2.mockClear();
      off();
      eventBus.emit(3);
      expect(listener).not.toBeCalled();
      expect(listener2).not.toBeCalled();
    });
    test('foreach off', () => {
      const eventBus = cm.createEventBus<number>();
      const listeners = Array(10)
        .fill(1)
        .map(() => jest.fn((_, off) => off()) as jest.Mock);
      listeners.forEach((l) => eventBus.on(l));

      eventBus.emit(1);
      expect(listeners.map((l) => l.mock.calls.length)).toEqual(Array(10).fill(1));
      expect(listeners.map((l) => l.mock.calls[0][0])).toEqual(Array(10).fill(1));

      listeners.forEach((l) => l.mockClear());
      eventBus.emit(2);
      expect(listeners.map((l) => l.mock.calls.length)).toEqual(Array(10).fill(0));
    });
    test('off next', () => {
      const eventBus = cm.createEventBus<number>();
      const listener = jest.fn(() => off());
      eventBus.on(listener);
      const listener2 = jest.fn();
      const off = eventBus.on(listener2);

      eventBus.emit(1);
      expect(listener).toBeCalled();
      expect(listener2).not.toBeCalled();
    });
    test('clear', () => {
      const eventBus = cm.createEventBus<number>();
      const listener = jest.fn();
      eventBus.on(listener);

      expect(listener).not.toBeCalled();
      eventBus.emit(1);
      expect(listener).toBeCalled();

      listener.mockClear();
      expect(listener).not.toBeCalled();
      eventBus.clear();
      eventBus.emit(2);
      expect(listener).not.toBeCalled();
    });
  });
  describe('DynamicEnum', () => {
    test('basic', () => {
      const map = new Map<number, number>([
        [1, 11],
        [2, 22],
      ]);
      const de = new cm.DynamicEnum(map);
      de.set(1, 111);
      expect(map.get(1)).toBe(111);
      expect(de.get(1)).toBe(111);
      expect(de.size).toBe(2);
      expect(map.size).toBe(2);

      de.setKeyByValue(111, 11);
      expect(map.get(1)).toBeUndefined();
      expect(de.get(1)).toBeUndefined();
      expect(map.get(11)).toBe(111);
      expect(de.getKeyByValue(111)).toBe(11);

      de.set(3, 33);
      expect(map.get(3)).toBe(33);
      expect(de.get(3)).toBe(33);
      expect(map.size).toBe(3);
      de.delete(3);
      expect(map.get(3)).toBeUndefined();
      expect(de.get(3)).toBeUndefined();
      expect(map.size).toBe(2);

      de.deleteByValue(111);
      expect(map.get(11)).toBeUndefined();
      expect(de.get(11)).toBeUndefined();
      expect(de.getKeyByValue(111)).toBeUndefined();
      expect(map.size).toBe(1);

      de.clear();
      expect(map.size).toBe(0);
    });
    test('setOrSwap', () => {
      const map = new Map<number, number>([
        [1, 11],
        [2, 22],
      ]);
      const de = new cm.DynamicEnum(map);
      expect(map.get(1)).toBe(11);
      expect(map.get(2)).toBe(22);

      de.setOrSwap(1, 22);
      expect(map.get(1)).toBe(22);
      expect(map.get(2)).toBe(11);

      de.setOrSwap(3, 33);
      expect(map.get(1)).toBe(22);
      expect(map.get(2)).toBe(11);
      expect(map.get(3)).toBe(33);
    });
    test('map', () => {
      const map = new Map<number, number>([
        [1, 11],
        [2, 22],
      ]);
      const de = new cm.DynamicEnum(map);
      expect(de.map((v, k) => k + v)).toEqual([12, 24]);
    });
    test('createByObj', () => {
      const de = cm.DynamicEnum.createByObj({ a: 1, b: 2, c: 3 });
      expect(de.size).toBe(3);
      expect(de.get('a')).toBe(1);
      expect(de.getKeyByValue(3)).toBe('c');
    });
  });
});
