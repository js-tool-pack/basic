import { randomInt } from './random';

// 使用下面的生成器代替
// /**
//  * 创建一个自增id的闭包函数
//  * @param init {number} 初始值
//  * @param step {number} 每次增加的值
//  */
// export function createIdFn(init = 0, step = 1) {
//     let id = init;
//     return function getId(_step = step) {
//         const current = id;
//         id += _step;
//         return current;
//     };
// }

/**
 * 创建一个自增id生成器
 *
 * 第一次next传值是无效的 解决方法参考https://es6.ruanyifeng.com/#docs/generator#next-%E6%96%B9%E6%B3%95%E7%9A%84%E5%8F%82%E6%95%B0
 *
 * @example
 *
 * // ----------- 什么参数都不传 -----------
 * const id = idGen();
 * id.next().value; // 0
 * id.next().value; // 1
 * id.next().value; // 2
 * id.next(10).value; // 12
 * id.next().value; // 13
 *
 *
 * // ----------- 传init与step -----------
 *  const id = idGen(10, 2);
 * id.next().value; // 10
 * id.next(3).value; // 13
 * id.next(10).value; // 23
 * id.next().value; // 25
 *
 * // ----------- next第一次传值无效 -----------
 *
 * const id = idGen();
 * id.next(11).value; // 0 // 第一次next传值无效,因为next只能传给下一个yield，而第一次之前没有yield
 * id.next().value; // 1
 * id.next().value; // 2
 *
 * // ----------- 使用for of迭代 -----------
 * const iter = idGen();
 * let curId = 0;
 * for (const id of iter) {
 *   id; // curId++
 *   if (id > 10) {
 *     iter.return(); // 使用Generator.prototype.return强制中断生成器
 *   }
 * }
 *
 * // ----------- 设置max -----------
 *  const gen = idGen(0, 1, 3);
 * const ids: number[] = [];
 * for (const id of gen) {
 *   ids.push(id);
 * }
 *
 * ids; // [0, 1, 2]
 * gen.next(); // { done: true, value: undefined }
 *
 *
 * // ----------- 倒序生成 -----------
 * const gen = idGen(2, -1, -1);
 * const ids: number[] = [];
 * for (const id of gen) {
 *   ids.push(id);
 * }
 *
 * ids; // [0, 1, 2].reverse()
 * gen.next(); // { done: true, value: undefined }
 *
 *
 *
 * @param [init = 0] 初始值
 * @param [step = 1] 每次增加的值
 * @param [end = Number.MAX_SAFE_INTEGER] 最大值；包左不包右原则，所以最后一个值是小于end的
 */
export function* idGen(
  init = 0,
  step = 1,
  end = Number.MAX_SAFE_INTEGER,
): Generator<number, void, void | number> {
  let id = init;
  const handle = init < end ? () => id < end : () => id > end;
  while (handle()) {
    const _step = (yield id) || step;
    id += _step;
  }
}

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
    total: 0,
    startTime: 0,
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

/**
 * 数组随机item生成器，直到遍历完为止
 *
 * @example
 *
 * const rand = randomItemGen([1, 2, 3]);
 * rand.next().value; // 1|2|3
 * rand.next().value; // 1|2|3
 * rand.next().value; // 1|2|3
 * rand.next(); // { done: true, value: undefined }
 *
 */
export function* randomItemGen<T>(arr: T[]): Generator<T, any, never> {
  const list = arr.slice();
  while (list.length) {
    const index = randomInt(list.length);
    yield list.splice(index, 1)[0] as T;
  }
}
