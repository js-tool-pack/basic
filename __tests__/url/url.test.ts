import * as u from '../../src/url/url';

describe('url.url', function () {
  test('stringifyUrlQuery', () => {
    expect(u.stringifyUrlQuery({ a: 1, b: 2, c: [3, 33], d: { f: '5', g: '6' } })).toBe(
      'a=1&b=2&c[0]=3&c[1]=33&d[f]=5&d[g]=6',
    );
    expect(
      u.stringifyUrlQuery({
        a: 1,
        b: 2,
        c: [3, 33],
        d: { f: '5', g: '6', h: undefined },
        e: undefined,
      }),
    ).toBe('a=1&b=2&c[0]=3&c[1]=33&d[f]=5&d[g]=6');
  });
  test('updateUrlQuery', () => {
    const updateUrlQuery = u.updateUrlQuery;
    let url = 'https://www.test.com/Openapi/api_detail?id=15#api-parameter';
    url = updateUrlQuery({ id: '100' }, url);
    expect(url).toEqual('https://www.test.com/Openapi/api_detail?id=100#api-parameter');
    expect(updateUrlQuery({ pid: '15' }, url)).toEqual(url);
    expect(updateUrlQuery({ pid: '15' })).toEqual('http://localhost/');

    const encoded = encodeURIComponent(url);
    expect(updateUrlQuery({ id: url }, url)).toEqual(
      `https://www.test.com/Openapi/api_detail?id=${encoded}#api-parameter`,
    );
    expect(updateUrlQuery({ id: url }, url, false)).toEqual(
      `https://www.test.com/Openapi/api_detail?id=${url}#api-parameter`,
    );
  });
  test('setUrlParam', () => {
    const setUrlQuery = u.setUrlQuery;
    let url = 'https://www.test.com/Openapi/api_detail?id=15#api-parameter';
    url = setUrlQuery({ id: '100' }, url);
    // update
    expect(url).toEqual('https://www.test.com/Openapi/api_detail?id=100#api-parameter');
    // add
    expect(setUrlQuery({ pid: '15' }, url)).toEqual(
      'https://www.test.com/Openapi/api_detail?id=100&pid=15#api-parameter',
    );
    // delete
    expect(setUrlQuery({ pid: undefined }, url)).toEqual(
      'https://www.test.com/Openapi/api_detail?id=100#api-parameter',
    );
    expect(setUrlQuery({ id: undefined }, url)).toEqual(
      'https://www.test.com/Openapi/api_detail#api-parameter',
    );
    expect(setUrlQuery({ pid: '15' })).toEqual('http://localhost/?pid=15');
  });
  test('UrlRegExp', () => {
    const ure = u.UrlRegExp;
    const realUrl = 'https://www.test.com/Openapi/api_detail?id=15#api-parameter';

    expect(ure.test(realUrl)).toBeTruthy();
    expect(
      'http://test.com,https://hello.cn'.match(new RegExp(`${ure.source.slice(1, -1)}`, 'g')),
    ).toEqual(['http://test.com', 'https://hello.cn']);
    // 不能分割带path的，所以不能用作分割用
    expect(
      'http://test.com/test,https://hello.cn'.match(
        new RegExp(`(${ure.source.slice(1, -1)})`, 'g'),
      ),
    ).not.toEqual(['http://test.com/12/sdffte/index', 'https://hello.cn']);
  });
  test('isUrl', () => {
    const isUrl = u.isUrl;

    expect(isUrl('https://www.test.com/Openapi/api_detail?id=15')).toBe(true);
    // 不能识别普通网址的端口号
    expect(
      isUrl('http://www.baidu.com:112332/index.php/admin/MonitorResultManager/monitorData'),
    ).toBe(false);
    expect(isUrl('http://www.baidu.com/index.php/admin/MonitorResultManager/monitorData')).toBe(
      true,
    );
    // 可以识别localhost的端口号
    expect(isUrl('http://localhost:1122/index.php/admin/MonitorResultManager/monitorData')).toBe(
      true,
    );
    // 端口号范围在2位数到5位数
    expect(isUrl('http://localhost:111222/index.php/admin/MonitorResultManager/monitorData')).toBe(
      false,
    );
    expect(isUrl('http://localhost:2/index.php/admin/MonitorResultManager/monitorData')).toBe(
      false,
    );

    expect(isUrl('www.baidu.com/index.php/admin/MonitorResultManager/monitorData')).toBe(false);

    // 能识别encodeURIComponent转换过的数据
    expect(
      isUrl(
        'http://www.baidu.com/index.php/admin/MonitorResultManager/monitorData?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on',
      ),
    ).toBe(true);
    // 识别hash
    expect(
      isUrl('http://www.baidu.com/index.php/?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on#api-parameter'),
    ).toBe(true);
    // 识别[]
    expect(isUrl('http://www.baidu.com/index.php/?a=1123&b[0]=1&b[1]=2&b[2]=3')).toBe(true);
    expect(isUrl('file://E:/wechatCache')).toBe(false);
  });
});
