/**
 * 创建一个时间累计生成器
 * ---
 * createTimeCountUp的Generator版本
 * @see createTimeCountUp
 *
 * @example
 * const t = timeCountUpGen();
 *
 * t.next().value; // 0
 *
 * await sleep(20);
 * t.next().value; // 20 <= t.next().value <= 30
 *
 * await sleep(30);
 * const beforePause = t.next().value; // 50 <= t.next().value <= 60
 *
 * // 暂停
 * t.next(false);
 * await sleep(10);
 * t.next().value === beforePause; // true
 * t.next().value; // 50 <= t.next().value <= 60
 *
 * // 继续
 * t.next(true);
 * await sleep(10);
 * t.next().value; // 60 <= t.next().value <= 70
 *
 * // 停止
 * t.return();
 * t.next() // { done: true, value: undefined }
 *
 * @example
 * // 使用for...of
 * async function test(){
 *   let count = 0;
 *   const t = timeCountUpGen();
 *   for(const v of t){
 *     console.log(v);
 *     await sleep(1000);
 *     count++ >= 10 && t.return();
 *   }
 * }
 * test();
 * // outputs
 * // 1010
 * // 2015
 * // 3024
 * // 4031
 * // 5040
 * // 6048
 * // 7057
 * // 8065
 * // 9073
 * // 10081
 */
export function createTimeCountUpGen(): Generator<number, void, boolean | void> {
  const startTime = Date.now();
  const pauseState = {
    startTime: 0,
    total: 0,
  };
  function pause(): void {
    // 判断是否已经暂停了，避免二次暂停bug
    if (pauseState.startTime === 0) pauseState.startTime = Date.now();
  }
  function play(): void {
    // 判断是否已经暂停了，避免二次play bug
    if (pauseState.startTime === 0) return;
    pauseState.total += Date.now() - pauseState.startTime;
    pauseState.startTime = 0;
  }
  function* g(): ReturnType<typeof createTimeCountUpGen> {
    while (true) {
      const endTime = pauseState.startTime ? pauseState.startTime : Date.now();
      const nextValue = yield endTime - startTime - pauseState.total;
      if (nextValue === void 0) continue;
      nextValue ? play() : pause();
    }
  }
  return g();
}
