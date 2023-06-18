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
