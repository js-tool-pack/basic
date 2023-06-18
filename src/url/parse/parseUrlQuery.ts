/**
 * 解析url单个query参数
 *
 * 来源于网页调起qq 只获取url参数的话可以使用这个
 * @tips 该函数有局限性，只能获取一般的参数，不能获取数组
 *
 * @example
 *
 * parseUrlQuery('id', 'https://www.test.com/Openapi/api_detail?id=15#api-parameter'); // '15'
 *
 * @param name query名
 * @param [url=location.href]
 * @param [decode=true] 是否decode，默认true
 */
export function parseUrlQuery(
  name: string,
  url = location.href /* node也有 */,
  decode = true,
): string {
  // 原代码hash也会获取
  // const re = new RegExp("(?:\\?|#|&)" + name + "=([^&]*)(?:$|&|#)", "i"),
  // 修改后不会获取到hash
  const re = new RegExp('(?:\\?|#|&)' + name + '=([^&#]*)(?:$|&|#)', 'i');
  const m = re.exec(url);
  if (m === null) return '';
  const result = m[1] as string;
  return decode ? decodeURIComponent(result) : result;
}
