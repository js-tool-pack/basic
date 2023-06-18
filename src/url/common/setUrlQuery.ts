import { UrlModel } from '../UrlModel';

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
export function setUrlQuery(
  param: {
    [k: string]: any;
  },
  url = location.href,
): string {
  const model = new UrlModel(url);
  Object.assign(model.query, param);
  return model.toString();
}
