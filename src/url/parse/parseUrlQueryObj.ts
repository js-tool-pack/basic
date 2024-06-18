import { revertObjFromPath } from '../../object';

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
  [key: string]: string[] | string;
} {
  const params = url.match(/[^&#?/]+=[^&#?/]+/g);
  if (!params) return {};
  return revertObjFromPath(params) as any;
}
