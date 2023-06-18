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
