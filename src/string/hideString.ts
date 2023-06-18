/**
 * 字符串遮掩部分或全部
 *
 * 可选传start、end
 *
 * @example
 *
 * // 省略参数
 * hideString('helloworld'); // '**********'
 * // 上面👆省略的约等于下面👇的参数
 * hideString('helloworld', { start: 0, replacement: '*' }); // '**********'
 *
 * // start等于end时，不做替换
 * hideString('helloworld', { start: 0, end: 0 }); // 'helloworld'
 * hideString('helloworld', { start: 5, end: 5 }); // 'helloworld'
 *
 * // 下面3种结果一样
 * hideString('helloworld', { start: 1, end: -1 }); // 'h********d'
 * hideString('helloworld', { start: 1, end: 9 }); // 'h********d'
 * hideString('helloworld', { start: -9, end: 9 }); // 'h********d'
 *
 * // start、end可逆
 * hideString('helloworld', { start: -1, end: 1 }); // 'h********d'
 * hideString('helloworld', { start: 9, end: 1 }); // 'h********d'
 *
 * // 支持表情
 * hideString('👨‍👨‍👧‍👦helloworld👨‍👨‍👧‍👦', { start: 1, end: -1 }); // '👨‍👨‍👧‍👦**********👨‍👨‍👧‍👦'
 * hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { start: 1, end: -1 }); // '👨‍👨‍👧‍👦***********👨‍👨‍👧‍👦'
 *
 * // 替换字符不对应实际字符数量
 * hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { start: -12, end: -1, replacementLen: 1 }); // '👨‍👨‍👧‍👦*👨‍👨‍👧‍👦'
 *
 * @param origin 原字符串
 * @param [options={}] 选项
 * @param [options.replacement='*'] 替换的字符串，默认为'*'
 * @param [options.start=0] 替换起始位置
 * @param [options.end] 替换结束位置 默认为原字符串长度
 * @param [options.replacementLen] 替换字符不对应实际字符数量
 */
export function hideString(
  origin: string,
  options?: {
    replacement?: string;
    start?: number;
    end?: number;
    replacementLen?: number;
  },
): string;
/**
 * 字符串遮掩部分或全部
 *
 * 可选传start、len
 *
 * @example
 *
 * // 省略参数
 * hideString('helloworld'); // '**********'
 * // 上面👆省略的约等于下面👇的参数
 * hideString('helloworld', { start: 0, len: 10 }); // '**********'
 *
 * // len为0时，不做替换
 * hideString('helloworld', { start: 0, len: 0 }); // 'helloworld'
 *
 * // 只传len约等于start为0
 * hideString('helloworld', { len: 9 }); // '*********d'
 * hideString('helloworld', { start: 0, len: 9 }); // '*********d'
 *
 * // 下面两种结果一样
 * hideString('helloworld', { start: 1, len: 8 }); // 'h********d'
 * hideString('helloworld', { start: -9, len: 8 }); // 'h********d'
 *
 * // 支持表情
 * hideString('👨‍👨‍👧‍👦helloworld👨‍👨‍👧‍👦', { start: 1, len: 10 }); // '👨‍👨‍👧‍👦**********👨‍👨‍👧‍👦'
 * hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { start: 1, len: 11 }); // '👨‍👨‍👧‍👦***********👨‍👨‍👧‍👦'
 *
 * // 替换字符不对应实际字符数量
 * hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { start: 1, len: 11, replacementLen: 1 }); // '👨‍👨‍👧‍👦*👨‍👨‍👧‍👦'
 *
 * @param origin 原字符串
 * @param [options={}] 选项
 * @param [options.replacement='*'] 替换的字符串，默认为'*'
 * @param [options.start=0] 替换起始位置
 * @param [options.len] 替换文字长度 默认为原字符串长度
 * @param [options.replacementLen] 替换字符不对应实际字符数量
 */
export function hideString(
  origin: string,
  options?: {
    replacement?: string;
    start?: number;
    len?: number;
    replacementLen?: number;
  },
): string;
/**
 * 字符串遮掩部分或全部
 *
 * 可选传len、end
 *
 * @example
 *
 * // 省略参数
 * hideString('helloworld'); // '**********'
 * // 上面👆省略的约等于下面👇的参数
 * hideString('helloworld', { len: 10, end: 10, replacement: '*' }); // '**********'
 *
 * // len为0时，不做替换
 * hideString('helloworld', { len: 0, end: 10 }); // 'helloworld'
 *
 * // 下面2种结果一样
 * hideString('helloworld', { len: 8, end: -1 }); // 'h********d'
 * hideString('helloworld', { len: 8, end: 9 }); // 'h********d'
 *
 * // 支持表情
 * hideString('👨‍👨‍👧‍👦helloworld👨‍👨‍👧‍👦', { len: 10, end: -1 }); // '👨‍👨‍👧‍👦**********👨‍👨‍👧‍👦'
 * hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { len: 11, end: -1 }); // '👨‍👨‍👧‍👦***********👨‍👨‍👧‍👦'
 *
 * // 替换字符不对应实际字符数量
 * hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { len: 11, end: -1, replacementLen: 1 }); // '👨‍👨‍👧‍👦*👨‍👨‍👧‍👦'
 *
 * @param origin 原字符串
 * @param [options={}] 选项
 * @param [options.replacement='*'] 替换的字符串，默认为'*'
 * @param [options.len] 默认为原字符串长度
 * @param [options.end] 替换结束位置 默认为原字符串长度
 * @param [options.replacementLen] 替换字符不对应实际字符数量
 */
export function hideString(
  origin: string,
  options?: {
    replacement?: string;
    end?: number;
    len?: number;
    replacementLen?: number;
  },
): string;
export function hideString(
  origin: string,
  {
    replacement = '*',
    replacementLen = -1,
    start,
    end,
    len,
  }: {
    replacement?: string;
    replacementLen?: number;
    start?: number;
    end?: number;
    len?: number;
  } = {},
): string {
  const segmenter = new Intl.Segmenter('fr', {
    granularity: 'grapheme',
  });
  const wordList = Array.from(segmenter.segment(origin));
  const wordListLen = wordList.length;

  // start、end的优先级比len高；
  const range = [start ?? 0, end ?? wordListLen] as [number, number];
  if (range[0] < 0) range[0] += wordListLen;
  if ((end as number) < 0) range[1] += wordListLen;

  // 有len无start、end的时候，start优先级比end高
  if (len !== undefined) {
    if (start === undefined && end !== undefined) range[0] = range[1] - len;
    else if (end === undefined) range[1] = range[0] + len;
  }

  // 也可以不判断直接sort，但是可能以后不太好理解为什么要sort
  if (range[1] < range[0]) range.sort();
  const _before = wordList.slice(0, range[0]);
  const _after = wordList.slice(range[1]);
  const [before, after] = [_before, _after].map((item) =>
    item.reduce((prev, cur) => prev + cur.segment, ''),
  );
  const center = replacement.repeat(
    replacementLen !== -1 ? replacementLen : wordListLen - _before.length - _after.length,
  );
  return before + center + after;
}
