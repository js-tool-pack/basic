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
