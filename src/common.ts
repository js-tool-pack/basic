import { typeOf } from './data-type';
import { createTimeCountDown } from './time';
import { getReversedObj } from './object';

/**
 * 防抖函数
 *
 * @example
 *
 * let times = 0;
 * const wrapFn = debounce(() => times++, 100);
 * wrapFn();
 * times; // 0
 * // 立即执行上一次的防抖函数
 * wrapFn.flush();
 * times; // 1
 * wrapFn();
 * // 取消上一次的防抖
 * wrapFn.cancel();
 * await sleep(110);
 * times; // 1
 *
 * @param callback 回调
 * @param delay 延时
 * @param [immediate = false] 为true的时候第一次会立即执行callback并禁止立即执行，之后时间间隔内的只会执行一次callback并恢复立即执行，
 *                            如果只执行了一次立即执行callback，那么会在一次delay延时后恢复可立即执行
 *
 * @returns 返回一个函数，并给该函数添加cancel取消执行和flush立即执行两个函数
 */
export function debounce<CB extends (...args: any[]) => any>(
  callback: CB,
  delay: number,
  immediate = false,
): CB & { cancel(): void; flush: CB } {
  let lastThis: any;
  let lastArgs: any;
  let lastResult: any;
  let timer: any;
  let canImmediateRun = true;
  const cancel = () => {
    clearTimeout(timer);
    timer = undefined;
  };
  const debounced = function (this: any, ...args: any[]) {
    if (timer) cancel();

    lastThis = this;
    lastArgs = args;
    if (canImmediateRun && immediate) {
      debounced.flush();
      canImmediateRun = false;
      timer = setTimeout(() => {
        canImmediateRun = true;
      }, delay);
      return lastResult;
    }
    timer = setTimeout(() => {
      cancel();
      debounced.flush();
      canImmediateRun = true;
    }, delay);

    return lastResult;
  } as ReturnType<typeof debounce>;
  debounced.cancel = cancel;
  debounced.flush = () => {
    lastResult = callback.apply(lastThis, lastArgs);
    lastThis = lastArgs = undefined;
    return lastResult;
  };
  return debounced as any;
}

/**
 * 节流函数
 *
 * @example
 *
 * // ----------- 基础用法 -----------
 * let count = 0;
 * let elseCount = 0;
 * let res = '';
 * const wrapFn = throttle((_res: string) => (count++, (res = _res)), 10, {
 *   invalidCB() {
 *     elseCount++;
 *   },
 * });
 *
 * wrapFn('0');
 * wrapFn('1');
 * wrapFn('2');
 *
 * res; // '0'
 * elseCount; // 2
 *
 * // ----------- 首调用 -----------
 * let times = 0;
 *
 * let wrapFn = throttle(() => times++, 100, { leading: false });
 * // 初始时时0次
 * times; // 0
 * // 执行一次
 * wrapFn();
 * // 由于节流包裹函数时就开启了节流，此时还在时间内，所以内部不执行
 * times; // 0
 * await sleep(120);
 * // 上一次执行的被丢弃了
 * times; // 0
 * // 在间隔期外执行
 * wrapFn();
 * // 此时成功执行
 * times; // 1
 *
 * times = 0;
 * // 立即执行
 * wrapFn = throttle(fn, 100, { leading: true });
 * times; // 0
 * wrapFn();
 * // 由于节流包裹时未开启计时，所以
 * times; // 1
 *
 * // ----------- 尾调用 -----------
 *
 * let times = 0;
 * const wrapFn = throttle(() => times++, 100, { leading: false, trailing: true });
 * // 初始时时0次
 * times; // 0
 * // 执行一次
 * wrapFn();
 * wrapFn();
 * wrapFn();
 * // 由于节流包裹函数时就开启了节流，此时还在时间内，所以内部不执行
 * times; // 0
 * await sleep(120);
 * // 上一次执行的不会被丢弃
 * times; // 1
 *
 *
 * @param callback 需要被节流函数包裹的函数
 * @param interval 间隔时间
 * @param options
 * @param [options.leading=true] 首调用
 * @param [options.trailing=false] 尾调用
 * @param options.invalidCB 间隔期间调用throttle返回的函数执行的回调  例如一个按钮5秒点击一次，不可点击时执行该函数
 */
export function throttle<CB extends (...args: any[]) => void | any>(
  callback: CB,
  interval: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    invalidCB?: (interval: number) => void;
  } = {},
): CB {
  const _options: Required<Parameters<typeof throttle>[2]> = {
    invalidCB: () => void 0,
    trailing: false,
    leading: true,
    ...options,
  };
  let getCountDown = _options.leading ? () => 0 : createTimeCountDown(interval);

  const db = _options.trailing ? debounce(callback, interval) : null;
  return function (this: any, ...args: any[]) {
    const countDown = getCountDown();
    if (countDown > 0) {
      _options.invalidCB(countDown);
      db?.apply(this, args);
      return;
    }
    db?.cancel();
    getCountDown = createTimeCountDown(interval);
    return callback.apply(this, args);
  } as CB;
}

// 第1种实现方式
/*export function throttle<CB extends (...args: any[]) => (void | any)>(
    callback: CB,
    delay: number,
    invalidCB?: (interval: number) => void,
): CB {
    let lastTime = 0;
    return function (...args: any[]) {
        const now = Date.now();
        const interval = now - lastTime;
        if (interval < delay) {
            invalidCB && invalidCB(delay - interval);
            return;
        }
        lastTime = now;
        return callback.apply(this, args);
    } as CB;
}*/

// 第三种实现方式，不能获取剩余时间或者另外获取时间，有点多余
/*export function throttleByTimeOut<CB extends (...args: any[]) => (void | any)>(
    callback: CB,
    delay: number,
    invalidCB?: (interval: number) => void,
): CB {
    let throttling = false;
    return function (...args: any[]) {
        if (throttling) {
            return;
        }
        throttling = true;
        setTimeout(() => {
            throttling = false;
        }, delay);
        return callback.apply(this, args);
    } as CB;
}*/

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
  callback: (times: number) => void | Promise<any>,
  interval: number,
  immediate = true,
): { promise: Promise<void>; cancel: () => void } {
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

  return { promise, cancel };
}

/**
 * 每隔一段事件返回字符串中的一个单词，类似打字机效果
 *
 * @example
 *
 * const s = 'hello world';
 *
 * const receive: string[] = [];
 * const diff: number[] = [];
 *
 * let lastNow = Date.now();
 * const { promise } = oneByOne(s, 10, (w, index) => {
 *   receive.push(w);
 *   const now = Date.now();
 *   diff.push(now - lastNow);
 *   lastNow = now;
 * });
 * await promise;
 *
 * receive; // equals s.split('')
 * diff[0]; // 0
 *
 * const _avg = avg(diff.slice(1));
 * // 虽然是间隔10秒，但由于js的setTimeout并不精准，所以会有波动
 * 10 <= _avg && _avg <= 11; // true
 */
export function oneByOne(
  words: string,
  delay: number,
  callback?: (word: string, index: number, words: string) => false | void,
): ReturnType<typeof polling> {
  const wordArr = words.split('');
  const res = polling((index) => {
    const word = wordArr.shift() as string;
    let running = Boolean(wordArr.length);
    if (callback) {
      const flag = callback(word, index - 1, words);
      running = running && flag !== false;
    }
    if (!running) res.cancel();
  }, delay);
  return res;
}

/**
 * 组合成new Function需要的参数
 *
 * 实现apply的时候可以使用此方法
 *
 * @see functionApply
 *
 */
export function generateFunctionCode(argsArrayLength: number): string {
  let code = 'return arguments[0][arguments[1]](';
  // 拼接args
  for (let i = 0; i < argsArrayLength; i++) {
    if (i > 0) {
      code += ',';
    }
    code += 'arguments[2][' + i + ']';
  }
  code += ')';
  // return object.property(args)
  // return arguments[0][arguments[1]](arg1, arg2, arg3...)
  return code;
}

/**
 * 模拟Function.prototype.apply函数代替扩展运算符，使用数组传值给不定参数的函数传参
 *
 * 案例
 * const args = [1, 2, 3];
 * (new Function(generateFunctionCode(args.length)))(object, property, args);
 *
 * @example
 *
 * '123'.padStart(6, '0'); // '000123'
 * const value = functionApply(
 *   { strPadStart: (s: string, count: number, pad: string) => s.padStart(count, pad) },
 *   'strPadStart',
 *   ['123', 6, '0'],
 * );
 * value; // '000123'
 *
 */
export function functionApply<T extends object, K extends keyof T>(
  obj: T,
  property: K,
  args: any[],
) {
  return new Function(generateFunctionCode(args.length))(obj, property, args);
}

/**
 * 生成uuid
 *
 * @example
 *
 * createUUID(); // 3976e106-3841-ee99-c65aa773c9d1b977 随机值
 *
 * @param [template='xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxx'] uuid模板:默认模板（8-4-4-16）
 */
export function createUUID(template = 'xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxx'): string {
  return template.replace(/x/g, () => (~~(Math.random() * 0x10)).toString(16));
}

/**
 * 创建一个enum对象，给非ts环境使用
 *
 * @example
 * // object
 * createEnum({ a: 'aa', b: 'bb' }); // { a: 'aa', b: 'bb', aa: 'a', bb: 'b' }
 * createEnum({ a: 1, b: 2 }); // { a: 1, b: 2, 1: 'a', 2: 'b' }
 *
 * // array
 * createEnum([0, 1]); // { '0': '0', '1': '1' }
 * createEnum(['a', 'b']); // { a: '0', b: '1', 0: 'a', 1: 'b' }
 *
 */
export function createEnum<T extends object, K extends keyof T>(
  obj: T,
): Readonly<T & { [k: string]: K }> {
  /* const res: any = {};
     for (let k in obj) {
         if (res.hasOwnProperty(k)) throw new Error("key multiple");
         res[res[k] = obj[k]] = k;
     }

     Object.freeze(res); // freeze值不可变
     // Object.seal(result); // seal值可以变
     return res;*/
  return Object.freeze(Object.assign({}, obj, getReversedObj(obj as any))) as any;
}

/**
 * 获取全局对象
 *
 * @example
 *
 * // browser
 * getRoot(); // window
 *
 * // nodejs
 * getRoot(); // global
 *
 */
export function getRoot() {
  try {
    // 像electron会禁用这种方法
    return Function('return this')();
  } catch (e) {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof self !== 'undefined') return self;
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;
  }
}

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
