import * as gen from '../src/generator';
describe('generator', function () {
  describe('idGen', () => {
    const idGen = gen.idGen;

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      idGen(0).return(0);
    });
  });
});
