import { createTimeCountUpGen } from './createTimeCountUpGen';

/**
 * 创建一个倒计时生成器
 * ---
 * createTimeCountDown的生成器版本
 *
 * @see createTimeCountDown
 * @see createTimeCountUpGen
 *
 * @example
 *
 * const t = createTimeCountDownGen(100);
 *
 * t.next().value; // 95 <= %t.next().value <= 100
 *
 * await sleep(10);
 * t.next().value; // 85 <= %t.next().value <= 95
 *
 * await sleep(10);
 * t.next().value; // 75 <= %t.next().value <= 85
 *
 * // 暂停
 * const beforePause = t.next(false).value;
 * await sleep(20);
 * t.next().value; // beforePause
 *
 * await sleep(20);
 * t.next().value; // beforePause
 * t.next().value; // 75 <= %t.next().value <= 85
 *
 * // 继续
 * t.next(true).value; // 75 <= t.next(true).value <= 85
 * await sleep(10);
 * t.next().value; // 65 <= %t.next().value <= 75
 *
 * await sleep(10);
 * t.next().value; // 55 <= %t.next().value <= 65
 *
 * // 停止
 * t.return();
 * t.next(); // { value: undefined, done: true }
 *
 * @example
 * // for...of
 * async function test() {
 *   console.time('t');
 *   for (const v of createTimeCountDownGen(10000)) {
 *     console.log('t', v);
 *     await sleep(1000);
 *   }
 *   console.timeEnd('t');
 * }
 *
 * test()
 * // outputs
 * // t 9999
 * // t 8997
 * // t 7987
 * // t 6977
 * // t 5970
 * // t 4961
 * // t 3954
 * // t 2945
 * // t 1938
 * // t 933
 * // t: 10077.828369140625 ms
 *
 * @param timeout 最大时间
 */
export function createTimeCountDownGen(timeout: number): ReturnType<typeof createTimeCountUpGen> {
  const timeCountUp = createTimeCountUpGen();
  function* g(): ReturnType<typeof createTimeCountDownGen> {
    let result: number;
    while ((result = timeout - (timeCountUp.next().value as number)) > 0) {
      const nextValue = yield result;
      if (nextValue === void 0) continue;
      timeCountUp.next(nextValue);
    }
  }
  return g();
}
