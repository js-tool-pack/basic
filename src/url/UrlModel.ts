import { stringifyUrlQuery } from './common';
import * as P from './parse';

/**
 * 解析url
 * @Author: dyh
 * @Date: 2019-10-17 10:44
 * @Description:
 */
export class UrlModel {
  query: Partial<{ [key: string]: string[] | string }> = {};
  port: number | string = '';
  protocol = '';
  host = '';
  path = '';
  href = '';
  hash = '';

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
      '{params}': () => {
        const query = stringifyUrlQuery(this.query);
        if (query) {
          return '?' + query;
        }
        return '';
      },
      '{protocol}': () => (this.protocol ? `${this.protocol}://` : ''),
      '{port}': () => (this.port ? `:${this.port}` : ''),
      '{pathname}': () => this.path || '',
      '{host}': () => this.host || '',
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
