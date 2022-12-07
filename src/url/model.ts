import * as P from './parse';
import { stringifyUrlQuery } from './url';

/**
 * 解析url
 * @Author: dyh
 * @Date: 2019-10-17 10:44
 * @Description:
 */
export class UrlModel {
  protocol = '';
  port: number | string = '';
  host = '';
  path = '';
  href = '';
  hash = '';
  query: Partial<{ [key: string]: string[] | string }> = {};

  // queryStr: string = "";

  constructor(url: string) {
    this.href = url;
    this.parseAll(url);
  }

  private parseAll(url: string) {
    this.protocol = P.parseUrlProtocol(url);
    this.host = P.parseUrlHost(url);
    this.port = P.parseUrlPort(url);
    this.path = P.parseUrlPath(url);
    this.hash = P.parseUrlHash(url);
    this.query = P.parseUrlQueryObj(url);
  }

  toString(template = '{protocol}{host}{port}{pathname}{params}{hash}') {
    const match = {
      '{protocol}': () => (this.protocol ? `${this.protocol}://` : ''),
      '{host}': () => this.host || '',
      '{port}': () => (this.port ? `:${this.port}` : ''),
      '{pathname}': () => this.path || '',
      '{params}': () => {
        const query = stringifyUrlQuery(this.query);
        if (query) {
          return '?' + query;
        }
        return '';
      },
      '{hash}': () => this.hash || '',
    };
    for (const k in match) {
      const replacer = match[k as keyof typeof match];
      const pattern = new RegExp(k, 'g');
      template = template.replace(pattern, replacer);
    }
    return template;
  }
}
