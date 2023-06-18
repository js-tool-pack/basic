/**
 * 从字符串中删除指定字符串(from)中重复的第n(num)个字符串(str)
 *
 * @example
 *
 * removeStrByNum('123/456/78', 2, '/'); // '123/45678'
 * removeStrByNum('123,456,,78', 2, ','); // '123,456,78'
 * removeStrByNum('hello thank you i m fine', 4, ' '); // 'hello thank you im fine'
 *
 * @param from 原字符串
 * @param num 要移除的字符串出现的第几次
 * @param removeStr 要查找并移除的字符串
 */
export function removeStrByNum(from: string, num: number, removeStr: string): string {
  let times = 1;
  return String(from).replace(new RegExp(removeStr, 'g'), (v) => (times++ === num ? '' : v));
}
