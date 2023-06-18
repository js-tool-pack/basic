import { UrlHostReg, UrlProtocolReg } from '../regs';

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
  return url.replace(new RegExp(`(${UrlHostReg.source}(?::\\d+)?)|${UrlProtocolReg.source}`), '');
}
