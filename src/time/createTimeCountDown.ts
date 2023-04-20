import { createTimeCountUp } from './createTimeCountUp';

/**
 * 创建一个倒计时闭包函数
 *
 * @example
 *
 * const timeout = 500;
 * const timeCountDown = createTimeCountDown(timeout);
 *
 * await sleep(50);
 * let t1 = timeCountDown();
 * timeout - 150 <= t1 && t1 <= timeout - 50; // true
 *
 * await sleep(150);
 * t1 = timeCountDown();
 * timeout - 300 <= t1 && t1 <= timeout - 200; // true
 *
 * await sleep(350);
 * timeCountDown(); // 0
 *
 * t1.pause(); // 暂停
 * t1.play(); // 继续
 *
 * @param timeout 倒计时时长(毫秒)
 * @returns {()=> number} 返回一个闭包函数，闭包返回的是倒计时，倒计时最小为0，不会是负数
 */
export function createTimeCountDown(timeout: number): ReturnType<typeof createTimeCountUp> {
  const timeCountUp = createTimeCountUp();
  const finishedFn = () => 0;
  let resFn = () => {
    const res = timeout - timeCountUp();
    if (res > 0) return res;
    resFn = finishedFn;
    return 0;
  };
  function closure(): number {
    return resFn();
  }
  closure.pause = timeCountUp.pause;
  closure.play = timeCountUp.play;
  return closure;
}

/*
/!**
 * 创建一个倒计时函数
 * @param countDown 目标毫秒
 *!/
export function createTimeCountDown(countDown: number): () => number {
    const startTime = Date.now();
    return function () {
        const ms = Date.now() - startTime;
        return countDown - ms;
    };
}*/
