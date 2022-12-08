/**
 * 等待一段时间后再执行后面的代码
 *
 * @example
 * // 等待100毫秒
 * await sleep(100);
 * /* do something *\/
 *
 * @param ms 等待时间，单位毫秒
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * 一种队列，分支wait和do
 *
 * 和async、await组合的区别是，lazy支持运行时编程
 *
 * @example
 *
 * lazy()
 *     .wait(10)
 *     .do(
 *       () =>
 *         new Promise(() => {
 *           // promise不resolve，那么后面的永远不会执行
 *         }),
 *     )
 *     .wait(20)
 *     .do((done) => {
 *       // 普通函数需要调用done才会继续
 *       done();
 *     });
 *
 */
export function lazy() {
  let queue = Promise.resolve();

  function then(cb: (done: Function, value: any) => void) {
    const q = queue;
    queue = new Promise((res) => {
      q.then((value) => {
        return cb(res, value);
      });
    });
  }

  const obj = {
    /**
     * @param {number} ms 等待毫秒数
     */
    wait(ms: number) {
      then((done, value) => setTimeout(() => done(value), ms));
      return obj;
    },

    /**
     * @param {((done: Function) => void) | (() => Promise<any>)} cb 回调返回一个值或返回一个promise 供下一个do回调调用
     */
    do(cb: (done: Function, value: unknown) => void | Promise<any>) {
      then((done, value) => {
        const res = cb(done, value);
        if (res && res.then) {
          res.then((val) => done(val));
        }
      });
      return obj;
    },
  };

  return obj;
}

/**
 * 串行版promise.all，执行完一个才会去执行下一个
 *
 * @example
 *
 * let timeStart = Date.now();
 * let timeEnd = timeStart;
 * let num = 0;
 * const list = [
 *   () => new Promise<number>((res) => {
 *     setTimeout(() => {
 *       timeEnd = Date.now();
 *       num = 200;
 *       res(200);
 *     }, 200);
 *   }),
 *   () => ((num = 2), Promise.resolve(2)),
 * ];
 * const res = await syncPromiseAll(list);
 *
 * inRange(timeEnd - timeStart, [200, 300]); // true
 * res; // [200, 2]
 * num; // 2
 *
 */
export function syncPromiseAll<T>(list: ((list: T[]) => Promise<T>)[]): Promise<T[]> {
  return list.reduce(
    (p, next) =>
      p.then((resList) =>
        next(resList).then((res) => {
          resList.push(res);
          return resList;
        }),
      ),
    Promise.resolve([] as T[]),
  );
}

/**
 * promise队列
 *
 * 任何一个reject都会中断队列 (跟reduceAsync类似)
 * 队列第一个会接收initValue作为参数，其余会接收上一个promise返回值作为参数
 *
 * @example
 *
 * const v = await promiseQueue(
 *   [(v) => Promise.resolve(`${v} thank you`), (v) => Promise.resolve(`${v} im fine`)],
 *   'hello',
 * );
 * v; // 'hello thank you im fine'
 *
 * const v2 = await promiseQueue([(v: any) => `${v} thank you`, (v: any) => `${v} im fine`] as any, 'hello');
 * v2; // 'hello thank you im fine'
 *
 *
 */
export function promiseQueue<T>(
  queue: Array<(lastValue: unknown) => Promise<unknown>>,
  initValue: T,
) {
  return queue.reduce(
    (p, next) => p.then((res) => next(res)),
    Promise.resolve(initValue) as Promise<unknown>,
  );
}

/*export async function promiseQueue<T>(queue: Array<(lastValue: unknown) => Promise<unknown>>, initValue: T) {
    let lastValue: unknown = initValue;
    await forEachAsync(async (promise) => {
        lastValue = await promise(lastValue);
    }, queue);
    return lastValue;
}*/

/**
 * 回调支持promise的debounce
 *
 * 如果callback执行了的话，那么不论是否resolved都不会再被reject
 *
 * @example
 *
 * let times = 0;
 *
 * const dbFn = debounceAsync(() => {
 *   return new Promise((resolve) => {
 *     resolve(times++);
 *   });
 * }, 100);
 *
 * await Promise.allSettled([dbFn(), dbFn(), dbFn(), dbFn()]);
 *
 * times; // 1
 *
 */
export function debounceAsync<T, CB extends (...args: any[]) => Promise<T>>(
  callback: CB,
  delay: number,
): CB {
  let timer: any = null;
  let rej: Function;

  return function (this: any, ...args: any[]) {
    return new Promise<T>((resolve, reject) => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
        rej('debounceAsync reject');
      }
      rej = reject;
      timer = setTimeout(async () => {
        timer = null;
        const result = await callback.apply(this, args);
        resolve(result);
      }, delay);
    });
  } as CB;
}

/**
 * 不使用setTimeout，使用promise实现的debounce
 *
 * 前一个promise未完成即reject，最后一个或者中断前调用的才会执行
 * 无法阻止cb被调用 不推荐使用
 *
 * 只有debounceByPromise(()=>{})().then的.then是防抖的，回调不防抖
 *
 * @example
 *
 * const dbFn = debounceByPromise((time = 50) => {
 *   const p = new Promise<number>((resolve) => {
 *     setTimeout(() => {
 *       resolve(time);
 *     }, time);
 *   });
 *   p.then(() => {
 *     times++;
 *   });
 *   return p;
 * });
 *
 * const res = await Promise.any([dbFn(40), dbFn(20), dbFn(60), dbFn(30)]);
 * res; // 30
 *
 *
 */
export function debounceByPromise<T, CB extends (...args: any[]) => Promise<T>>(callback: CB): CB {
  let rejectFn: Function;
  return function (this: any, ...args: any[]): Promise<T> {
    rejectFn && rejectFn();
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (res, rej) => {
      rejectFn = rej;
      const result = await callback.apply(this, args);
      res(result);
    });
  } as CB;
}
