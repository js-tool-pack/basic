import { createArray } from './array';
import { isArrayLike, isNumber } from './data-type';

/**
 * min end都不传  return Math.random()
 *
 * @example
 *
 * randomFloat(); // 生成0-1之间的浮点数
 *
 */
export function randomFloat(): number;
/**
 * 生成0-max之间的随机数, min = 0，不包含max
 *
 * @example
 *
 * randomFloat(10); // 生成0-10之间的浮点数
 */
export function randomFloat(max: number): number;
/**
 * 生成min到max之间的随机数 包含min不包含max
 *
 * @example
 *
 * randomFloat(2, 10); // 生成2-10之间的浮点数
 */
export function randomFloat(min: number, max: number): number;
/**
 * 生成min到max之间的随机数组 包含min不包含max, len：数组长度
 *
 * @example
 *
 * randomFloat(2, 8, 10); // 生成长度为10的随机数组，每个成员的范围是2-8
 *
 */
export function randomFloat(min: number, max: number, len: number): number[];
/**
 * 生成随机浮点数
 */
export function randomFloat(min?: number, max?: number, len?: number): number | number[] {
  // randomFloat()
  if (!arguments.length) return Math.random();

  let _min = min as number;
  let _max = max as number;

  // randomFloat(max)
  if (arguments.length === 1) {
    _max = _min;
    _min = 0;
  }

  // randomFloat(min, max)
  if (len === undefined) {
    const dif = _max - _min;
    return Math.random() * dif + _min;
  }
  return createArray({ len, fill: () => randomFloat(_min, _max) });
}

/**
 * min end都不传 返回范围：0 - Number.MAX_SAFE_INTEGER
 *
 * @example
 *
 * randomFloat(); // 生成0-Number.MAX_SAFE_INTEGER之间的整数
 */
export function randomInt(): number;
/**
 * min = 0 生成0-max之间的随机数，不包含max
 *
 * @example
 *
 * randomInt(10); // 生成0-10之间的整数
 */
export function randomInt(max: number): number;
/**
 * 生成min到max之间的随机数 包含min不包含max
 *
 * @example
 *
 * randomInt(2,10); // 生成2-10之间的整数
 */
export function randomInt(min: number, max: number): number;
/**
 * 生成min到max之间的随机数组 包含min不包含max len：数组长度
 *
 * @example
 *
 * randomInt(5,10,7); // 生成长度为7的整数数组，每个成员范围为5-10之间
 */
export function randomInt(min: number, max: number, len: number): number[];
export function randomInt(min?: number, max?: number, len?: number): number | number[] {
  // randomInt()
  if (!arguments.length) return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

  let _min = min as number;
  let _max = max as number;
  // randomInt(max)
  if (arguments.length === 1) {
    _max = _min;
    _min = 0;
  }

  if (len === undefined) {
    const dif = _max - _min;
    // 直接调用randomFloat的话randomInt(-10,10)永远都不会出现-10
    // 用~~做整数转换的时候，数字太大会变为负数: 如1000 * 60 * 60 * 24 * 30
    //  return ~~(Math.random() * dif) + (min as number);
    return Math.floor(Math.random() * dif) + _min;
  }
  return createArray({ len, fill: () => randomInt(_min, _max) });
}

/**
 * 随机获取数组中的一个
 *
 * @example
 *
 * randomItem([1, 2, 3]); // 返回1-3中的一个
 *
 */
export function randomItem<T>(arr: T[]): T {
  const index = randomInt(arr.length);
  return arr[index] as T;
}

/**
 * 创建一个数组随机item的生成器，直到遍历完为止
 *
 * @example
 *
 * const rand = randomItemsGen([1, 2, 3]);
 * rand.next().value; // 1|2|3
 * rand.next().value; // 1|2|3
 * rand.next().value; // 1|2|3
 * rand.next(); // { done: true, value: undefined }
 *
 */
export function* randomItemsGen<T>(arr: T[]): Generator<T, any, never> {
  const list = arr.slice();
  while (list.length) {
    const index = randomInt(list.length);
    yield list.splice(index, 1)[0] as T;
  }
}

/**
 * 数组洗牌，不会改变原数组
 *
 * @example
 *
 * const arr = shuffle([1,2,3,4,5]); // 返回一个打乱顺序后的数组
 */
export function shuffle<T, A extends ArrayLike<T>>(arr: A): A {
  if (!isArrayLike(arr)) throw new TypeError();
  const newArr: any = Array.prototype.slice.call(arr);
  let m = newArr.length;
  while (m) {
    const i = randomInt(m--);
    [newArr[m], newArr[i]] = [newArr[i], newArr[m]];
  }
  return newArr;
}

/*
export function shuffle<T>(arr: ArrayLike<T>): T[] {
    if (!isArrayLike(arr)) throw new TypeError();
    const result: T[] = [];
    const indexArr = createArray({len: arr.length});
    while (indexArr.length) {
        const index = randomInt(indexArr.length);
        const arrIndex = indexArr.splice(index, 1)[0];
        result.push(arr[arrIndex]);
    }
    return result;
}
*/

/**
 * 随机RGB颜色
 *
 * @example
 *
 * randomRGB(); // 'rgb([0-255], [0-255], [0-255])'
 *
 */
export function randomRGB(): string {
  const num = randomInt(0, 255, 3);
  return `rgb(${num[0]},${num[1]},${num[2]})`;
}

/**
 * 随机RGBA颜色
 *
 * @example
 *
 * randomRGBA(); // 'rgb([0-255], [0-255], [0-255], [0-1])'
 *
 */
export function randomRGBA(): string {
  const num = randomInt(0, 255, 3);
  const opacity = +randomFloat().toFixed(2);
  return `rgba(${num[0]},${num[1]},${num[2]},${opacity})`;
}

/**
 * 随机HEX颜色
 *
 * @example
 *
 * randomHEX(); // '#[0-9a-f]{6}'
 *
 */
export function randomHEX(): string {
  const num = randomInt(0xffffff).toString(16);
  return '#' + num.padStart(6, '0');
}

/**
 * 随机颜色，无参数时默认为HEX格式的颜色
 *
 * @see randomHEX
 *
 * @example
 *
 * randomColor(); // '#[0-9a-f]{6}'
 */
export function randomColor(): string;
/**
 * 随机类型颜色
 *
 * @see randomHEX
 * @see randomRGB
 * @see randomRGBA
 *
 * @example
 *
 * // 随机HEX颜色
 * randomColor('HEX');
 * // 随机RGB颜色
 * randomColor('RGB');
 * // 随机RGBA颜色
 * randomColor('RGBA');
 *
 */
export function randomColor(type: 'HEX' | 'RGB' | 'RGBA'): string;
/**
 * 生成HEX颜色数组
 */
export function randomColor(len: number): string[];
/**
 * 生成 'HEX' | 'RGB' | 'RGBA' 颜色数组
 */
export function randomColor(type: 'HEX' | 'RGB' | 'RGBA', len: number): string[];
export function randomColor(type?: string | number, len?: number): string[] | string {
  if (isNumber(type)) {
    len = type;
    type = 'HEX';
  }
  if (type === undefined) {
    type = 'HEX';
  }
  type = type.toUpperCase();
  if (len === undefined) {
    const map = {
      HEX: randomHEX,
      RGB: randomRGB,
      RGBA: randomRGBA,
    };
    return (map[type as keyof typeof map] || map.HEX)();
  } else {
    return createArray({ len, fill: () => randomColor(type as 'HEX' | 'RGB' | 'RGBA') });
  }
}
