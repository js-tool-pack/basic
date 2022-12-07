import { revertObjFromPath } from '../object';

// url规则文档：https://datatracker.ietf.org/doc/html/rfc3986

const protocolReg = /^(\w+):\/\//;

/**
 * 解析url protocol
 *
 * @example
 *
 * u.parseUrlProtocol('file:///E:/wechatCache'); // 'file'
 * u.parseUrlProtocol('https://www.baidu.com/index'); // 'https'
 * u.parseUrlProtocol('http://www.baidu.com/index'); // 'http'
 * u.parseUrlProtocol('/index.php'); // ''
 * u.parseUrlProtocol(); // 'http'
 *
 * @param {string} [url = location.href]
 */
export function parseUrlProtocol(url: string = location.href): string {
  const reg = new RegExp(protocolReg);
  let schema = '';
  if (reg.test(url)) {
    schema = RegExp.$1;
  }
  return schema;
}

export const hostReg = /(?:\w+:\/\/|\/\/)((?:[\w\-\u4e00-\u9fa5]+\.?)+\w+)/;

/**
 * 解析url host
 *
 * @example
 *
 * u.parseUrlHost('https://www.baidu.com/index'); // 'www.baidu.com'
 * u.parseUrlHost('https://www.1223-tewre.com/index'); // 'www.1223-tewre.com'
 * u.parseUrlHost('https://www.1223_tewre.com/index'); // 'www.1223_tewre.com'
 * u.parseUrlHost('https://www.测试_tewre.com/index'); // 'www.测试_tewre.com'
 * u.parseUrlHost('https://www.测试-tewre.com/index'); // 'www.测试-tewre.com'
 * u.parseUrlHost('https://www.-tewre测试.com/index'); // 'www.-tewre测试.com'
 * u.parseUrlHost('https://www.测试.test.com/index'); // 'www.测试.test.com'
 * u.parseUrlHost('http://www.baidu.com/index'); // 'www.baidu.com'
 * u.parseUrlHost('http://www.baidu.com:8080/index'); // 'www.baidu.com'
 * u.parseUrlHost('www.baidu.com:8080/index'); // ''
 * u.parseUrlHost('file://E:/wechatCache'); // ''
 * u.parseUrlHost('/index.php'); // ''
 * u.parseUrlHost(); // 'localhost'
 *
 * @param {string} [url = location.href]
 */
export function parseUrlHost(url: string = location.href): string {
  const exec = new RegExp(hostReg).exec(url);
  return exec ? (exec[1] as string) : '';
}

/**
 * 解析url port
 *
 * @example
 *
 * u.parseUrlPort('/'); // ''
 * u.parseUrlPort('https://www.测试.test.com:8080'); // '8080'
 * u.parseUrlPort('://localhost:3000'); // '3000'
 * u.parseUrlPort(); // ''
 *
 * @param {string} [url = location.href]
 */
export function parseUrlPort(url: string = location.href): string {
  url = url.split('?')[0] as string;
  if (/:(\d+)/.test(url)) {
    return RegExp.$1;
  }
  return '';
}

/**
 * 解析url path
 *
 * @example
 *
 * u.parseUrlPath('https://www.baidu.com/index'); // '/index'
 * u.parseUrlPath('https://www.1223-tewre.com/index'); // '/index'
 * u.parseUrlPath('https://www.测试.test.com/对方是否'); // '/对方是否'
 * u.parseUrlPath('https://www.测试.test.com/index?test=123'); // '/index'
 * u.parseUrlPath('https://www.测试.test.com/index/test#test'); // '/index/test'
 * u.parseUrlPath('https://www.测试.test.com:8080/index/test#test'); // '/index/test'
 * u.parseUrlPath('file:///E:/wechatCache'); // '/E:/wechatCache'
 * u.parseUrlPath('/index.php'); // '/index.php'
 * u.parseUrlPath(); // '/'
 *
 * @param {string} [url = location.href]
 */
export function parseUrlPath(url: string = location.href): string {
  // 去掉query、hash
  url = url.split(/[?#]/)[0] as string;
  // 去掉schema
  return url.replace(new RegExp(`(${hostReg.source}(?::\\d+)?)|${protocolReg.source}`), '');
}

/**
 * 解析url hash
 *
 * @example
 *
 * u.parseUrlHash('/index.php#index/admin'); // '#index/admin'
 * u.parseUrlHash('/index.php/#/index/admin#test'); // '#/index/admin#test'
 * u.parseUrlHash('/index.php'); // ''
 * u.parseUrlHash(); // ''
 *
 * @param {string} [url = location.href]
 */
export function parseUrlHash(url: string = location.href): string {
  const index = url.indexOf('#');
  if (index < 0) return '';
  return url.substring(index);
}

/**
 * 获取hash中的param
 *
 * @example
 *
 * getUrlHashParam("a", "test.com/index?a=param/#/test?a=hash") // "hash"
 * getUrlHashParam("a", "test.com/index?a=param") // ""
 *
 * @param name
 * @param {string} [url = location.href]
 * @param decode 是否decode
 */
export function parseUrlHashQuery(name: string, url = location.href, decode = true): string {
  return parseUrlQuery(name, parseUrlHash(url), decode);
}
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
/**
 * 解析url query对象
 *
 * @example
 *
 * getUrlQueryObj('?a=1&a=2&a=3'); // { a: ['1', '2', '3'] }
 * getUrlQueryObj('?a[]=1&a[]=2&a[]=3'); // { a: ['1', '2', '3'] }
 * getUrlQueryObj('?a%5B%5D=1&a%5B%5D=2&a%5B%5D=3'); // { a: ['1', '2', '3'] }
 * getUrlQueryObj('?a=1&a[]=2&a%5B%5D=3'); // { a: ['1', '2', '3'] }
 * getUrlQueryObj('?a=1&a[1]=2'); // { a: ['1', '2'] }
 * getUrlQueryObj('?a=1&a[1]=2&a[2]=3'); // { a: ['1', '2', '3'] }
 * getUrlQueryObj('a=1&a[1]=2&a[2]=3'); // { a: ['1', '2', '3'] }
 *
 * @param {string} [url = location.href]
 */
export function parseUrlQueryObj(url: string = location.href): {
  [key: string]: string | string[];
} {
  const params = url.match(/[^&#?/]+=[^&#?/]+/g);

  if (!params) return {};

  return revertObjFromPath(params) as any;
}
