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
): Generator<number, void, number | void> {
  let id = init;
  const handle = init < end ? () => id < end : () => id > end;
  while (handle()) {
    const _step = (yield id) || step;
    id += _step;
  }
}
