/**
 * 创建一个记录了调用时间的计时器闭包函数
 *
 * @example
 *
 * const timeCountUp = createTimeCountUp();
 * timeCountUp(); // 0
 *
 * await sleep(100);
 * const t1 = timeCountUp();
 * 100 <= t1 && t1 <= 200; // true
 *
 * await sleep(100);
 * const t2 = timeCountUp();
 * 200 <= t2 && t2 <= 300; // true
 *
 * await sleep(600);
 * const t3 = timeCountUp();
 * 800 <= t3 && t3 <= 900; // true
 *
 * t3.pause(); // 暂停
 * t3.play(); // 继续
 *
 */
export function createTimeCountUp(): {
  (): number;
  pause(): void;
  play(): void;
} {
  const startTime = Date.now();
  const pause = {
    total: 0,
    startTime: 0,
  };
  function closure(this: any) {
    const endTime = pause.startTime ? pause.startTime : Date.now();
    return endTime - startTime - pause.total;
  }
  closure.pause = function () {
    pause.startTime = Date.now();
  };
  closure.play = function () {
    pause.total += Date.now() - pause.startTime;
    pause.startTime = 0;
  };
  return closure;
}
