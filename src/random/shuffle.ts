import { randomInt } from './randomInt';
import { isArrayLike } from '../data-type';

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
