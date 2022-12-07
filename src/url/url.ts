import { forEachObj, reduceObj } from '../object';
import { UrlModel } from './model';

/**
 * 把对象转成url query
 *
 * @example
 *
 * u.stringifyUrlQuery({ a: 1, b: 2, c: [3, 33], d: { f: '5', g: '6' } }); // 'a=1&b=2&c[0]=3&c[1]=33&d[f]=5&d[g]=6'
 *
 */
export function stringifyUrlQuery(query: { [k: string]: any }): string {
  return reduceObj(
    query,
    (initValue, v, k) => {
      if (v === undefined) return initValue;
      if (typeof v === 'object') {
        forEachObj(v, (val, key) => {
          if (val === undefined) return;
          initValue.push(`${k}[${key as string}]=${encodeURIComponent(val)}`);
        });
      } else {
        initValue.push(`${k}=${encodeURIComponent(v)}`);
      }
      return initValue;
    },
    [] as string[],
  ).join('&');
}

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
  param: { [k: string]: any },
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

/**
 * 设置url参数，可新增或删除参数
 *
 * @example
 *
 * let url = 'https://www.test.com/Openapi/api_detail?id=15#api-parameter';
 * url = setUrlQuery({ id: '100' }, url);
 * // update
 * url; // 'https://www.test.com/Openapi/api_detail?id=100#api-parameter'
 * // add
 * setUrlQuery({ pid: '15' }, url); // 'https://www.test.com/Openapi/api_detail?id=100&pid=15#api-parameter'
 * // delete
 * setUrlQuery({ pid: undefined }, url); // 'https://www.test.com/Openapi/api_detail?id=100#api-parameter'
 * setUrlQuery({ id: undefined }, url); // 'https://www.test.com/Openapi/api_detail#api-parameter'
 * setUrlQuery({ pid: '15' }); // 'http://localhost/?pid=15'
 *
 * @param param
 * @param url
 */
export function setUrlQuery(param: { [k: string]: any }, url = location.href): string {
  const model = new UrlModel(url);
  Object.assign(model.query, param);
  return model.toString();
}

// 参考async-validator
export const UrlRegExp = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4])|(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*\\.[a-z\\u00a1-\\uffff]{2,})|localhost)(?::\\d{2,5})?(?:([/?#])[^\\s]*)?$',
  'i',
);

/**
 * 判断字符串是否是url
 *
 * @example
 *
 * isUrl('https://www.test.com/Openapi/api_detail?id=15'); // true
 *
 * // 不能识别普通网址的端口号
 * isUrl('http://www.baidu.com:112332/index.php/admin/MonitorResultManager/monitorData'); // false
 * isUrl('http://www.baidu.com/index.php/admin/MonitorResultManager/monitorData'); // true
 *
 * // 可以识别localhost的端口号
 * isUrl('http://localhost:1122/index.php/admin/MonitorResultManager/monitorData'); // true
 *
 * // 端口号范围在2位数到5位数
 * isUrl('http://localhost:111222/index.php/admin/MonitorResultManager/monitorData'); // false
 * isUrl('http://localhost:2/index.php/admin/MonitorResultManager/monitorData'); // false
 *
 * isUrl('www.baidu.com/index.php/admin/MonitorResultManager/monitorData'); // false
 *
 * // 能识别encodeURIComponent转换过的数据
 * isUrl('http://www.baidu.com/index.php/admin/MonitorResultManager/monitorData?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on'); // true
 *
 * // 识别hash
 * isUrl('http://www.baidu.com/index.php/?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on#api-parameter'); // true
 *
 * // 识别[]
 * isUrl('http://www.baidu.com/index.php/?a=1123&b[0]=1&b[1]=2&b[2]=3'); // true
 * isUrl('file://E:/wechatCache'); // false
 *
 * @param url
 */
export function isUrl(url: string): boolean {
  return UrlRegExp.test(url);
}
