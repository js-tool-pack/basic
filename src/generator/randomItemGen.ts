import { randomInt } from '../random';

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
