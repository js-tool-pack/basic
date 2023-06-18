import { UrlHostReg } from '../regs';

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
  const exec = new RegExp(UrlHostReg).exec(url);
  return exec ? (exec[1] as string) : '';
}
