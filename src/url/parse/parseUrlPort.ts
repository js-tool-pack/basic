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
