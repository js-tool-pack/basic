/**
 * 轮询函数
 *
 * 用于代替setInterval，回调且支持promise
 *
 * @example
 *
 * let t = 0;
 *
 * let { cancel, promise } = polling((times) => {
 *   t = times;
 *   if (times === 10) cancel();
 * }, 10);
 * await promise;
 * t; // 10
 *
 * @param callback 回调，返回值支持promise
 * @param interval  间隔
 * @param [immediate=true] 是否马上执行第一次
 */
export function polling(
  callback: (times: number) => Promise<any> | void,
  interval: number,
  immediate = true,
): {
  promise: Promise<void>;
  cancel: () => void;
} {
  enum state {
    running,
    stopped,
  }
  let timer: number;
  let status: state;
  let times = 1;
  let lastTime = Date.now();
  let diff = 0;
  let resolve: () => void;
  const cancel = () => {
    status = state.stopped;
    resolve();
    clearTimeout(timer);
  };
  const promise = new Promise<void>((res) => {
    resolve = res;
    function run() {
      const back = callback(times++);
      back instanceof Promise ? back.then(timeout, cancel) : timeout();
    }
    function timeout() {
      const delay = interval - diff;
      timer = setTimeout(() => {
        if (status !== state.running) return;
        const now = Date.now();
        diff = now - lastTime - delay;
        lastTime = now;
        run();
      }, delay) as any;
    }
    status = state.running;
    if (immediate) {
      run();
    } else {
      timeout();
    }
  });
  return {
    promise,
    cancel,
  };
}
