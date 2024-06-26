import { sleep } from '../src/promise';
import * as dc from '../src/decorator';

describe('decorator', function () {
  test('Debounce', async () => {
    expect.assertions(3);

    const Debounce = dc.Debounce;

    const now = Date.now();

    class Test {
      value: string | number = '';
      times = 0;
      time = 0;

      @Debounce(1000)
      test(value: string | number) {
        this.times++;
        this.time = Date.now();
        this.value = value;
      }
    }

    const t = new Test();

    t.test(1);
    t.test(2);
    t.test(3);
    t.test(4);
    t.test(5);
    t.test(6);

    await sleep(1100);

    expect(t.times).toBe(1);
    expect(t.time - now).toBeGreaterThanOrEqual(100);
    expect(t.value).toBeGreaterThanOrEqual(6);
  });
  test('Throttle', async () => {
    expect.assertions(2);

    const Throttle = dc.Throttle;

    // const now = Date.now();

    class Test {
      value: string | number = '';
      times = 0;
      time = 0;

      @Throttle(100)
      test(value: string | number) {
        this.times++;
        this.time = Date.now();
        this.value = value;
      }
    }

    const t = new Test();

    t.test(1);
    t.test(2);
    t.test(3);
    t.test(4);
    t.test(5);
    t.test(6);

    await sleep(100);

    expect(t.times).toBe(1);
    // expect(t.time - now).toBe(0); // 不准确 各种设备上结果不一样
    expect(t.value).toBe(1);
  });

  test('Polling', async () => {
    expect.assertions(1);

    const Polling = dc.Polling;

    class Test {
      times = 0;

      @Polling(10, true)
      test(times?: number) {
        this.times = times as number;
        if ((times as number) >= 5) {
          return Promise.reject();
        } else {
          // console.log(times);
          return Promise.resolve();
        }
      }
    }

    const t = new Test();

    await t.test();

    expect(t.times).toBe(5);

    // await sleep(5000);
  });
  test('Polling 2', async () => {
    expect.assertions(2);

    const Polling = dc.Polling;

    class Test {
      times = 0;

      @Polling(100, false)
      test(times?: number) {
        this.times = times as number;
      }
    }

    const t = new Test();

    t.test();

    await sleep(550);
    (t.test as any).cancel();
    expect(t.times).toBe(5);
    t.test();
    await sleep(350);
    expect(t.times).toBe(3);

    // await sleep(5000);
  });
});
