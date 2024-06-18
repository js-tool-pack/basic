import * as u from '../../src/url/parse';

describe('url.parse', function () {
  const url =
    'http://www.baidu.com:112332/index.php/admin/MonitorResultManager/monitorData?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on&b%5B1%5D=on&c=1&c=2&c=3&d=1,2,3,4,5&pid=19&pname=%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B#test?hash=1';

  test('parseUrlQueryObj', () => {
    const getUrlQueryObj = u.parseUrlQueryObj;
    expect(getUrlQueryObj('?a=1&a=2&a=3')).toEqual({ a: ['1', '2', '3'] });
    expect(getUrlQueryObj('?a[]=1&a[]=2&a[]=3')).toEqual({ a: ['1', '2', '3'] });
    expect(getUrlQueryObj('?a%5B%5D=1&a%5B%5D=2&a%5B%5D=3')).toEqual({ a: ['1', '2', '3'] });
    expect(getUrlQueryObj('?a=1&a[]=2&a%5B%5D=3')).toEqual({ a: ['1', '2', '3'] });
    expect(getUrlQueryObj('?a=1&a[1]=2')).toEqual({ a: ['1', '2'] });
    expect(getUrlQueryObj('?a=1&a[1]=2&a[2]=3')).toEqual({ a: ['1', '2', '3'] });
    expect(getUrlQueryObj('a=1&a[1]=2&a[2]=3')).toEqual({ a: ['1', '2', '3'] });

    const url =
      'test/aaa=1213123?a=1123&b[0]=1&b[1]=2&d[d]=1&d[e]=2?t=1231&b=123123&a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on&b%5B1%5D=on&c=1&c=2&c=3&d=1,2,3,4,5&pid=19&pname=%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B#test?hash=1&hash2=2';
    const obj = getUrlQueryObj(url) as any;
    expect(obj).toEqual({
      d: Object.assign(['1,2,3,4,5'], { d: '1', e: '2' }),
      pname: '环球贸易项目基坑地铁2号线隧道结构自动化监测',
      b: ['on', 'on', '123123'],
      a: ['1123', '123', 'on'],
      c: ['1', '2', '3'],
      aaa: '1213123',
      hash2: '2',
      t: '1231',
      pid: '19',
      hash: '1',
    });
    expect(obj.pname).toEqual('环球贸易项目基坑地铁2号线隧道结构自动化监测');
    expect(u.parseUrlQueryObj()).toEqual({});
  });
  test('parseUrlHashQuery', () => {
    const url = 'test.com/index?a=param/#/test?a=hash';
    expect(u.parseUrlHashQuery('a', url)).toEqual('hash');
    expect(u.parseUrlHashQuery('a', 'test.com/index?a=param')).toEqual('');
    expect(u.parseUrlHashQuery('a')).toEqual('');
  });
  test('parseUrlHash', () => {
    expect(u.parseUrlHash('/index.php#index/admin')).toBe('#index/admin');
    expect(new URL('https://test.com/index.php#index/admin').hash).toBe('#index/admin');
    expect(u.parseUrlHash('/index.php/#/index/admin#test')).toBe('#/index/admin#test');
    expect(u.parseUrlHash('/index.php')).toBe('');
    expect(u.parseUrlHash()).toBe('');
  });
  test('parseUrlProtocol', () => {
    expect(u.parseUrlProtocol('file:///E:/wechatCache')).toBe('file');
    expect(u.parseUrlProtocol('https://www.baidu.com/index')).toBe('https');
    expect(u.parseUrlProtocol('http://www.baidu.com/index')).toBe('http');
    expect(u.parseUrlProtocol('/index.php')).toBe('');
    expect(u.parseUrlProtocol()).toBe('http');
  });
  test('parseUrlHost', () => {
    expect(u.parseUrlHost('https://www.baidu.com/index')).toBe('www.baidu.com');
    expect(u.parseUrlHost('https://www.1223-tewre.com/index')).toBe('www.1223-tewre.com');
    expect(u.parseUrlHost('https://www.1223_tewre.com/index')).toBe('www.1223_tewre.com');
    expect(u.parseUrlHost('https://www.测试_tewre.com/index')).toBe('www.测试_tewre.com');
    expect(u.parseUrlHost('https://www.测试-tewre.com/index')).toBe('www.测试-tewre.com');
    expect(u.parseUrlHost('https://www.-tewre测试.com/index')).toBe('www.-tewre测试.com');
    expect(u.parseUrlHost('https://www.测试.test.com/index')).toBe('www.测试.test.com');
    expect(u.parseUrlHost('http://www.baidu.com/index')).toBe('www.baidu.com');
    expect(u.parseUrlHost('http://www.baidu.com:8080/index')).toBe('www.baidu.com');
    expect(u.parseUrlHost('www.baidu.com:8080/index')).toBe('');
    expect(u.parseUrlHost('file://E:/wechatCache')).toBe('');
    expect(u.parseUrlHost('/index.php')).toBe('');
    expect(u.parseUrlHost()).toBe('localhost');
  });
  test('parseUrlPath', () => {
    expect(u.parseUrlPath('https://www.baidu.com/index')).toBe('/index');
    expect(u.parseUrlPath('https://www.1223-tewre.com/index')).toBe('/index');
    expect(u.parseUrlPath('https://www.测试.test.com/对方是否')).toBe('/对方是否');
    expect(u.parseUrlPath('https://www.测试.test.com/index?test=123')).toBe('/index');
    expect(u.parseUrlPath('https://www.测试.test.com/index/test#test')).toBe('/index/test');
    expect(u.parseUrlPath('https://www.测试.test.com:8080/index/test#test')).toBe('/index/test');
    expect(new URL('https://www.测试.test.com:8080/index/test#test').pathname).toBe('/index/test');
    expect(new URL('file:///E:/wechatCache').pathname).toBe('/E:/wechatCache');
    expect(u.parseUrlPath('file:///E:/wechatCache')).toBe('/E:/wechatCache');
    expect(u.parseUrlPath('/index.php')).toBe('/index.php');
    expect(u.parseUrlPath()).toBe('/');
  });
  test('parseUrlPort', () => {
    expect(u.parseUrlPort('/')).toBe('');
    expect(u.parseUrlPort('https://www.测试.test.com:8080')).toBe('8080');
    expect(u.parseUrlPort('://localhost:3000')).toBe('3000');
    expect(u.parseUrlPort()).toBe('');
  });
  test('parseUrlHost', () => {
    expect(u.parseUrlHost('/')).toBe('');
    expect(u.parseUrlPort('/')).toBe('');
    expect(u.parseUrlPort()).toBe('');

    expect(u.parseUrlPath('/index.php/admin/MonitorResultManager')).toBe(
      '/index.php/admin/MonitorResultManager',
    );
    expect(u.parseUrlProtocol('')).toBe('');
    expect(u.parseUrlHost('/index.php/admin#absdf-23_123')).toBe('');
    expect(u.parseUrlHost('')).toBe('');
    expect(u.parseUrlHash('/index.php/admin#absdf-23_123')).toBe('#absdf-23_123');
    expect(u.parseUrlHash('/index.php/admin')).toBe('');

    expect(u.parseUrlProtocol('file://test.com')).toEqual('file');
  });
  test('parseUrlQuery', () => {
    const fn = u.parseUrlQuery;

    expect(fn('id', 'https://www.test.com/Openapi/api_detail?id=15#api-parameter')).toEqual('15');
    expect(fn('pname', url, false)).toEqual(
      '%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B',
    );
    expect(fn('pname', url)).toEqual('环球贸易项目基坑地铁2号线隧道结构自动化监测');
    const url2 = 'www.test.com/?id=15&a=1&b=2&c=3&d[0]=4&d[1]=5';
    expect(fn('id', url2)).toEqual('15');
    expect(fn('a', url2)).toEqual('1');
    expect(fn('b', url2)).toEqual('2');
    expect(fn('c', url2)).toEqual('3');
    expect(fn('f', url2)).toBe('');
    expect(fn('f')).toBe('');
    // 该函数有局限性，只能获取一般的参数，不能获取数组
    // expect(fn("d[0]", url2)).toEqual("4");
    // expect(fn("d[1]", url2)).toEqual("5");
    // expect(fn("d", url2)).toEqual([4, 5]);
  });
});
