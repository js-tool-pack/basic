import { forEachObj } from '../../object';

/**
 * 只能修改url已存在的参数，不能新增或删除参数
 *
 * @example
 *
 * let url = 'https://www.test.com/Openapi/api_detail?id=15#api-parameter';
 * url = updateUrlQuery({ id: '100' }, url);
 * url; // url = 'https://www.test.com/Openapi/api_detail?id=100#api-parameter'
 * updateUrlQuery({ pid: '15' }, url); // equals url
 * updateUrlQuery({ pid: '15' }); // 'http://localhost/'
 *
 * @param param
 * @param [url=location.href]
 * @param [encode=true]
 */
export function updateUrlQuery(
  param: {
    [k: string]: any;
  },
  url = location.href,
  encode = true,
): string {
  forEachObj(param, (value, name) => {
    const re = new RegExp('(?:\\?|#|&)' + name + '=([^&#]*)(?:$|&|#)', 'i');
    if (re.test(url)) {
      const s = encode ? encodeURIComponent(value) : value;
      url = url.replace(`${name}=${RegExp.$1}`, `${name}=${s}`);
    }
  });
  return url;
}
