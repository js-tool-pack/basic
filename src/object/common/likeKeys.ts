/**
 * 查找对象中与param key类似的key
 *
 * @example
 *
 * // array
 * likeKeys([1, 2, 3, 4, 5, 6, 7], '0'); // ['0']
 * likeKeys([1, 2, 3, 4, 5, 6, 7, 1, 1, 1, 1, 1, 1], '0'); // ['0', '10']
 *
 * // object
 * likeKeys({ test: 1, test2: 2, test3: 3 }, 'test'); // ['test', 'test2', 'test3']
 *
 * // map
 * const map = new Map<string, number | string>([
 *   ['aa', 1],
 *   ['bb', 2],
 *   ['hello', 'world'],
 * ]);
 * likeKeys(map, /a+|b+/); // ['aa', 'bb']
 */
export function likeKeys(target: Map<string, any> | object, key: string | RegExp): string[] {
  const reg = new RegExp(key);
  if ('undefined' !== typeof Map && target instanceof Map) {
    // keys = [...obj.keys()]; // babel编译成es5会编译成[].concat，无法使用
    const keys: string[] = [];
    for (const k of target.keys()) {
      if (reg.test(k)) keys.push(k);
    }
    return keys;
  }
  return Object.keys(target).filter((key) => reg.test(key));
}
