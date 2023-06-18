import { typeOf } from '../../data-type';

/**
 * 创建数组
 * ---
 * len与end两个都有值时，以小的为准；
 * 包含start，不包含end
 *
 * @example
 * // returns [0, 1]
 * createArray({end: 2});
 * @example
 * // returns [0, 1]
 * createArray({start: 0, end: 2});
 * @example
 * // [1, 1]
 * createArray({start:0, end:2, len:2, fill:1});
 * @example
 * // returns [1, 2]
 * createArray(start: 0, len: 2, fill: item => item+1);
 */
export function createArray<T = number>({
  start = 0,
  end,
  len,
  fill,
}: {
  start?: number;
  end?: number;
  len?: number;
  fill?: T | ((item: number, index: number, end: number) => T);
}): T[] {
  let _end: number = start;
  if (len && end) {
    _end = Math.min(start + len, end);
  } else {
    if (len !== undefined) {
      _end = start + len;
    }
    if (end !== undefined) {
      _end = end;
    }
  }
  let callback: (item: number, index: number, end: number) => any;
  switch (typeOf(fill)) {
    case 'function':
      callback = fill as typeof callback;
      break;
    case 'undefined':
    case 'null':
      callback = (i) => i;
      break;
    default:
      callback = () => fill;
  }
  const arr: any[] = [];
  for (let item = start, index = 0; item < _end; item++, index++) {
    arr.push(callback(item, index, _end));
  }
  return arr;
}
