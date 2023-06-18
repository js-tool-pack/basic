/**
 * 根据模板创建出字符串
 *
 * 除了面试题暂时找不到应用场景
 *
 * @example
 *
 * ```ts
 *  // 基础用法
 * smartRepeat('2[a]'); // 'aa'
 * smartRepeat('1[a]'); // 'a'
 *
 * // 无效数量
 * smartRepeat('[a]'); // '[a]'
 *
 * // 嵌套
 * smartRepeat('2[2[a]2[b]]'); // 'aabbaabb'
 * smartRepeat('2[2[a]2[b]2[c]]'); // 'aabbccaabbcc'
 * smartRepeat('2[2[a]2[bc]]'); // 'aabcbcaabcbc'
 * smartRepeat('2[2[a]77]'); // 'aa77aa77'
 * smartRepeat('2[1[1]2[2]3[2[5]2[6]]]'); // '122556655665566122556655665566'
 * smartRepeat('2[1[a]3[b]2[3[c]4[d]]]'); // 'abbbcccddddcccddddabbbcccddddcccdddd'
 * smartRepeat('2[1[1]3[b]2[1[1]4[d]]]'); // '1bbb1dddd1dddd1bbb1dddd1dddd'
 *
 * // 多余的]当普通字符处理
 * smartRepeat('2[2]]'); // '22]'
 *
 * // `[${string}]`前面非数字则保持原样
 * smartRepeat('2[b][2]'); // 'bb[2]'
 * // `[${string}]`前面是数字则补上前面的数字
 * smartRepeat('2[2][2]'); // '2222222222222222222222'
 * smartRepeat('2[2][2]').length; // 22
 *
 * ```
 */
export function smartRepeat(format: string): string {
  let exec;
  const re = /(\d+)\[([^[\]]+)](?!\d+\[)/;
  while ((exec = re.exec(format))) {
    const [, count, repeatValue] = exec;
    // 第一种方式
    format = format.replace(re, (repeatValue as string).repeat(Number(count)));
    // 第二种方式
    // const start = format.substring(0, exec.index);
    // const end = format.substring(exec.index + exec[0].length);
    // format = start + strRepeat(repeatValue, count) + end;
  }

  return format;
}
