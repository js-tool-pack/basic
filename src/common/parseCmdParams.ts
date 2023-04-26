import { typeOf } from '../data-type';

/**
 * 命令行的参数转为Map
 * @notice 部分命令行工具中"--"是全写，"-"是缩写 这里未分
 *
 * @example
 *
 * function pcp(value: string, prefix?: string, df?: string) {
 *   return Object.fromEntries(parseCmdParams(value.split(' ').slice(2), prefix, df));
 * }
 *
 * pcp('node test.js test.js -a -b -c'); // { default: 'test.js', a: true, b: true, c: true, }
 *
 * pcp('node test.js test.js -a=123'); // { default: 'test.js', a: '123' }
 *
 * pcp('node test.js test.js -a=123 333 555 -b 666 888 -c=1 -b=999'); // { default: 'test.js', a: ['123', '333', '555'], b: ['666', '888', '999'], c: '1', }
 *
 * @param arr 命令行参数数组
 * @param prefix 前缀 --d --f 前缀是"--"
 * @param defaultKey 如果前面没有变量名那么使用默认
 */
export function parseCmdParams(
  arr: string[],
  prefix = '-',
  defaultKey = 'default',
): Map<string, string[] | string | boolean> {
  const eqReg = /([^=]+)=([\s\S]+)?/;
  const isKeyReg = new RegExp(`^${prefix}`);
  const list = arr.slice();
  const map: ReturnType<typeof parseCmdParams> = new Map();
  let currentKey = defaultKey;
  let item: string;
  function setKey(): void {
    let key = item.replace(isKeyReg, '');
    if (eqReg.test(key)) {
      key = RegExp.$1;
      const value = RegExp.$2;
      value && list.unshift(value);
    }
    currentKey = key;
    if (!map.has(currentKey)) {
      map.set(currentKey, true);
    }
  }

  // fullFight
  function setValue() {
    const existValue = map.get(currentKey);
    switch (typeOf(existValue)) {
      case 'undefined':
      case 'boolean':
        map.set(currentKey, item);
        break;
      case 'array':
        (existValue as Array<string>).push(item);
        break;
      default:
        map.set(currentKey, [existValue as string, item]);
    }
  }
  while ((item = list.shift() as string)) {
    if (isKeyReg.test(item)) {
      setKey();
      continue;
    }
    setValue();
  }
  return map;
}
