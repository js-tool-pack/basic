import {
  createTimeCountUpGen,
  idGen,
  createTimeCountDownGen,
  randomItemGen,
} from '../src/generator';
import { sleep } from '../src/promise';
describe('generator', function () {
  function expectInRange(value: any, range: [number, number]) {
    expect(value).toBeGreaterThanOrEqual(range[0]);
    expect(value).toBeLessThanOrEqual(range[1]);
  }
  describe('idGen', () => {
    test('什么参数都不传', () => {
      const id = idGen();
      expect(id.next().value).toBe(0);
      expect(id.next().value).toBe(1);
      expect(id.next().value).toBe(2);
      expect(id.next(10).value).toBe(12);
      expect(id.next().value).toBe(13);
    });

    test('传init与step', () => {
      const id = idGen(10, 2);
      expect(id.next().value).toBe(10);
      expect(id.next(3).value).toBe(13);
      expect(id.next(10).value).toBe(23);
      expect(id.next().value).toBe(25);
    });

    test('next第一次传值无效', () => {
      const id = idGen();
      expect(id.next(11).value).toBe(0); // 第一次next传值无效,因为next只能传给下一个yield，而第一次之前没有yield
      expect(id.next().value).toBe(1);
      expect(id.next().value).toBe(2);
    });

    test('使用for of迭代', () => {
      const iter = idGen();
      let curId = 0;
      for (const id of iter) {
        expect(id).toBe(curId++);
        if (id > 10) {
          iter.return(); // 使用Generator.prototype.return强制中断生成器
        }
      }
    });

    test('设置max', () => {
      const gen = idGen(0, 1, 3);
      const ids: number[] = [];
      for (const id of gen) {
        ids.push(id);
      }

      expect(ids).toEqual([0, 1, 2]);
      expect(gen.next()).toEqual({ done: true, value: undefined });
    });

    test('倒序生成', () => {
      const gen = idGen(2, -1, -1);
      const ids: number[] = [];
      for (const id of gen) {
        ids.push(id);
      }

      expect(ids).toEqual([0, 1, 2].reverse());
      expect(gen.next()).toEqual({ done: true, value: undefined });
    });
    test('转成数组', () => {
      expect([...idGen(0, 1, 3)]).toEqual([0, 1, 2]);
      expect([...idGen(0, 2, 3)]).toEqual([0, 2]);
      // @ts-expect-error
      idGen(0).return(0);
    });
  });

  test('createTimeCountUpGen', async () => {
    const t = createTimeCountUpGen();

    expect(t.next().value).toBe(0);

    await sleep(20);
    expectInRange(t.next().value, [20, 30]);

    await sleep(30);
    const beforePause = t.next().value;
    expectInRange(beforePause, [50, 60]);

    // 暂停
    t.next(false);
    await sleep(10);
    expect(t.next().value).toBe(beforePause);
    t.next(false);
    expectInRange(t.next().value, [50, 60]);

    // 继续
    t.next(true);
    await sleep(10);
    expectInRange(t.next(true).value, [60, 70]);
    await sleep(10);
    expectInRange(t.next(true).value, [70, 80]);

    // 停止
    t.return();
    expect(t.next()).toEqual({ done: true, value: undefined });

    // return 不接收任何参数
    // @ts-expect-error
    t.return(1);
  });

  test('createTimeCountDownGen', async () => {
    const t = createTimeCountDownGen(100);

    expectInRange(t.next().value, [95, 100]);

    await sleep(10);
    expectInRange(t.next().value, [85, 95]);

    await sleep(10);
    expectInRange(t.next().value, [75, 85]);

    // 暂停
    const beforePause = t.next(false).value;
    await sleep(20);
    expect(t.next().value).toBe(beforePause);

    await sleep(20);
    expect(t.next().value).toBe(beforePause);
    expectInRange(t.next().value, [75, 85]);

    // 继续
    expectInRange(t.next(true).value, [75, 85]);
    await sleep(10);
    expectInRange(t.next().value, [65, 75]);

    await sleep(10);
    expectInRange(t.next().value, [50, 65]);

    // 停止
    t.return();
    expect(t.next()).toEqual({ value: undefined, done: true });
  });

  test('randomItemGen', () => {
    const list = [1, 2, 3, 4, 5];
    const g = randomItemGen(list);
    const res = list.map(() => g.next().value);
    expect(g.next()).toEqual({ done: true, value: undefined });
    expect(list.every((it) => res.includes(it))).toBeTruthy();
    expect(res).not.toEqual(list);
    expect(res.sort()).toEqual(list);

    const rand = randomItemGen([1, 2, 3]);
    expectInRange(rand.next().value, [1, 3]); // 1|2|3
    expectInRange(rand.next().value, [1, 3]); // 1|2|3
    expectInRange(rand.next().value, [1, 3]); // 1|2|3
    expect(rand.next()).toEqual({ done: true, value: undefined });
  });
});
