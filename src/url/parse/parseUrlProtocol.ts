import { UrlProtocolReg } from '../regs';

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
  const reg = new RegExp(UrlProtocolReg);
  let schema = '';
  if (reg.test(url)) {
    schema = RegExp.$1;
  }
  return schema;
}
