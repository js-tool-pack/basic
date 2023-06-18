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
