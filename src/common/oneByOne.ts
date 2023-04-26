import { polling } from './polling';

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
