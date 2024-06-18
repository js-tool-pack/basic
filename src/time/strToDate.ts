/**
 * 字符串转为date对象
 * ---
 * 因为部分浏览器如苹果手机直接new Date("2018-08-01 10:20:10")会失败，所以提取出这样一个函数
 *
 * 直接new Date还有时区问题，例如
 *
 * ```
 * new Date('2020-05-06').getHours(); // 8 默认8点(东八区)
 * new Date('2020-5-6').getHours(); // 0  默认0点
 * ```
 *
 * 只有`'Tue Dec 13 2022 01:16:59 GMT+0800 (中国标准时间)'`这种时间才直接new
 *
 * @example
 *
 * [
 *   '2020-02-02 10:10:10',
 *   '2020/02/02 10:10:10',
 *   '2020/02-02-10-10-10',
 *   '2020/02/02 10/10/10',
 *   '2020/02/02/10/10/10',
 * ].forEach((time: any) => {
 *   formatDate(strToDate(time); // '2020-02-02 10:10:10'
 * });
 * strToDate('' as any); // null
 * strToDate('123cvsd213' as any); // null
 * strToDate('2020l02/02/10/10/10' as any); // null
 * strToDate(undefined as any); // null
 *
 * @param [date='yyyy-MM-dd hh:mm:ss'] 格式，默认值: 'yyyy-MM-dd hh:mm:ss'
 */
export function strToDate(
  date:
    | `${number}-${number}-${number} ${number}:${number}:${number}`
    | `${number}/${number}/${number} ${number}:${number}:${number}`
    | `${number}-${number}-${number} ${number}:${number}`
    | `${number}/${number}/${number} ${number}:${number}`
    | `${number}-${number}-${number}`
    | `${number}/${number}/${number}`,
): Date | null {
  // 检测非数字、非/、非:、非-
  if (!date || /[^/\d: -]/.test(date)) return null; // 去除不符合规范的字符串
  const arr: number[] = date.split(/[- :/]/).map((item) => Number(item));
  if (arr.length < 6) {
    for (let i = arr.length; i < 6; i++) {
      arr[i] = i < 3 ? 1 : 0; // 年月日最小为1
    }
  }

  return new Date(arr[0] as number, (arr[1] as number) - 1, arr[2], arr[3], arr[4], arr[5]);
}
