import { UrlRegExp } from '../regs';

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
