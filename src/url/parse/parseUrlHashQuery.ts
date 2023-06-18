import { parseUrlQuery } from './parseUrlQuery';
import { parseUrlHash } from './parseUrlHash';

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
