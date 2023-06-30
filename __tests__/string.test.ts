import * as cm from '../src/string';
const { formatNumber, strTemplate, removeStrByNum, smartRepeat, capitalize, fromCamel, camelCase } =
  cm;

describe('string', function () {
  test('formatNumber', () => {
    // 小数位不转换
    expect(formatNumber(123456789)).toBe('123,456,789');
    expect(formatNumber(123)).toBe('123');
    expect(formatNumber(5763423)).toBe('5,763,423');
    expect(formatNumber(123123.1111)).toBe('123,123.1111');

    // 小数位转换
    expect(formatNumber(123.11, true)).toBe('123.11');
    expect(formatNumber(123123.1111, true)).toBe('123,123.111,1');
    expect(formatNumber(12312311.111111, true)).toBe('12,312,311.111,111');
    expect(formatNumber(12312311.111111)).toBe('12,312,311.111111');
    expect(formatNumber(12312311.111111, true, ' ')).toBe('12 312 311.111 111');
  });
  test('strTemplate', () => {
    expect(strTemplate('1%s3', '2')).toBe('123');
    expect(strTemplate('hell%s worl%s', 'o', 'd')).toBe('hello world');
    expect(strTemplate('hell%s worl%s')).toBe('hell worl');
    expect(strTemplate('1%s%s86', 0, '0')).toBe('10086');
  });
  test('removeStrByNum', () => {
    expect(removeStrByNum('123/456/78', 2, '/')).toBe('123/45678');
    expect(removeStrByNum('123,456,,78', 2, ',')).toBe('123,456,78');
    expect(removeStrByNum('hello thank you i m fine', 4, ' ')).toBe('hello thank you im fine');
  });
  test('smartRepeat', () => {
    // 基础用法
    expect(smartRepeat('2[a]')).toBe('aa');
    expect(smartRepeat('1[a]')).toBe('a');

    // 无效数量
    expect(smartRepeat('[a]')).toBe('[a]');

    // 嵌套
    expect(smartRepeat('2[2[a]2[b]]')).toBe('aabbaabb');
    expect(smartRepeat('2[2[a]2[b]2[c]]')).toBe('aabbccaabbcc');
    expect(smartRepeat('2[2[a]2[bc]]')).toBe('aabcbcaabcbc');
    expect(smartRepeat('2[2[a]77]')).toBe('aa77aa77');
    expect(smartRepeat('2[1[1]2[2]3[2[5]2[6]]]')).toBe('122556655665566122556655665566');
    expect(smartRepeat('2[1[a]3[b]2[3[c]4[d]]]')).toBe('abbbcccddddcccddddabbbcccddddcccdddd');
    expect(smartRepeat('2[1[1]3[b]2[1[1]4[d]]]')).toBe('1bbb1dddd1dddd1bbb1dddd1dddd');

    // 多余的]当普通字符处理
    expect(smartRepeat('2[2]]')).toBe('22]');

    // `[${string}]`前面非数字则保持原样
    expect(smartRepeat('2[b][2]')).toBe('bb[2]');
    // `[${string}]`前面是数字则补上前面的数字
    expect(smartRepeat('2[2][2]')).toBe('2222222222222222222222');
    expect(smartRepeat('2[2][2]').length).toBe(22);
  });
  test('capitalize', () => {
    expect(capitalize('A')).toBe('A');
    expect(capitalize('1')).toBe('1');
    expect(capitalize('ab')).toBe('Ab');
    expect(capitalize('Ab')).toBe('Ab');
    expect(capitalize('aa')).toBe('Aa');
    // edge
    expect(capitalize('')).toBe('');
  });

  test('fromCamel', () => {
    // 默认下划线分割
    expect(fromCamel('a')).toBe('a');
    expect(fromCamel('A')).toBe('a');
    expect(fromCamel('Test')).toBe('test');
    expect(fromCamel('TEST')).toBe('test');
    expect(fromCamel('testCamel')).toBe('test_camel');
    expect(fromCamel('TestCamelString')).toBe('test_camel_string');
    expect(fromCamel('TestCamelSTring')).toBe('test_camel_string');

    // 自定义分割字符
    expect(fromCamel('TestCamelSTring', '-')).toBe('test-camel-string');

    // 转大写
    expect(fromCamel('TestCamelSTring', '-', true)).toBe('TEST-CAMEL-STRING');
  });

  test('camelCase', () => {
    // cases
    expect(camelCase('A')).toBe('a');
    // 转大驼峰
    expect(camelCase('A', undefined, true)).toBe('A');

    expect(camelCase('a')).toBe('a');
    // 转大驼峰
    expect(camelCase('a', undefined, true)).toBe('A');

    expect(camelCase('1')).toBe('1');

    expect(camelCase('ab')).toBe('ab');
    // 转大驼峰
    expect(camelCase('ab', undefined, true)).toBe('Ab');

    // 默认选项
    expect(camelCase('aa_bb')).toBe('aaBb');
    expect(camelCase('test_camel_string')).toBe('testCamelString');
    expect(camelCase('test__camel_string')).toBe('testCamelString');

    // 默认分隔符，转大驼峰
    expect(camelCase('test_camel_string', undefined, true)).toBe('TestCamelString');

    // 正则匹配分隔符
    expect(camelCase('test-camel_string', /[-_]/)).toBe('testCamelString');

    // edge
    expect(camelCase('', '')).toBe('');
  });
  describe('getStringLen', function () {
    const fn = cm.getStringLen;
    test('base', () => {
      let value = '123';
      expect(value.length).toBe(3);
      expect(fn(value)).toBe(3);

      value = '一二三';
      expect(value.length).toBe(3);
      expect(fn(value)).toBe(3);

      value = '123一二三';
      expect(value.length).toBe(6);
      expect(fn(value)).toBe(6);

      value = '1一2二3三 &';
      expect(value.length).toBe(8);
      expect(fn(value)).toBe(8);

      value = '😜';
      expect(value.length).toBe(2);
      expect(fn(value)).toBe(1);

      value = '鬱哉華夏，新流水繼';
      expect(value.length).toBe(9);
      expect(fn(value)).toBe(9);
    });
    test('multiple symbols', () => {
      let value = '👨‍👩‍👧‍👦'; // 苹果emoji符号'爸爸、妈妈和儿女一家'
      expect(value.length).toBe(11);
      expect(fn(value)).toBe(1);

      value = '👬';
      expect(value.length).toBe(2);
      expect(fn(value)).toBe(1);

      value = '1一😂2二👱3👬 &';
      expect(value.length).toBe(13);
      expect(fn(value)).toBe(10);

      value = '😂👱👬';
      expect(value.length).toBe(6);
      expect(fn(value)).toBe(3);

      value = '😂👱👬👨‍👩‍👧👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👧👩‍👧‍👧';
      expect(value.length).toBe(49);
      expect(fn(value)).toBe(8);

      value = '𠮷好';
      expect(value.length).toBe(3);
      expect(fn(value)).toBe(2);

      value = '🙎🏿';
      expect(value.length).toBe(4);
      expect(fn(value)).toBe(1);

      value = '👩🙎🏿👱🏿';
      expect(value.length).toBe(10);
      expect(fn(value)).toBe(3);
    });
  });
  describe('hideString', () => {
    const hideString = cm.hideString;

    it('start,end', () => {
      expect(hideString('helloworld')).toBe('**********');
      expect(hideString('helloworld', { start: 0, replacement: '*' })).toBe('**********');

      expect(hideString('helloworld', { start: 0, end: 0 })).toBe('helloworld');

      expect(hideString('helloworld', { start: 5, end: 5 })).toBe('helloworld');

      expect(hideString('helloworld', { start: 5 })).toBe('hello*****');
      expect(hideString('helloworld', { end: 5 })).toBe('*****world');

      expect(hideString('helloworld', { start: 1, end: -1 })).toBe('h********d');
      expect(hideString('helloworld', { start: 1, end: 9 })).toBe('h********d');
      expect(hideString('helloworld', { start: -9, end: 9 })).toBe('h********d');

      expect(hideString('helloworld', { start: -1, end: 1 })).toBe('h********d');
      expect(hideString('helloworld', { start: 9, end: 1 })).toBe('h********d');

      expect(hideString('helloworld', { replacement: '+', start: 2, end: -2 })).toBe('he++++++ld');

      expect(hideString('👨‍👨‍👧‍👦helloworld👨‍👨‍👧‍👦', { start: 1, end: -1 })).toBe('👨‍👨‍👧‍👦**********👨‍👨‍👧‍👦');
      expect(hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { start: 1, end: -1 })).toBe('👨‍👨‍👧‍👦***********👨‍👨‍👧‍👦');
      expect(hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { start: -12, end: -1 })).toBe('👨‍👨‍👧‍👦***********👨‍👨‍👧‍👦');

      expect(hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { start: -12, end: -1, replacementLen: 1 })).toBe(
        '👨‍👨‍👧‍👦*👨‍👨‍👧‍👦',
      );
    });

    it('start,len', () => {
      expect(hideString('helloworld')).toBe('**********');
      expect(hideString('helloworld', { start: 0, len: 10 })).toBe('**********');

      expect(hideString('helloworld', { start: 1, len: 8 })).toBe('h********d');
      expect(hideString('helloworld', { start: -9, len: 8 })).toBe('h********d');

      expect(hideString('helloworld', { start: 0, len: 0 })).toBe('helloworld');

      expect(hideString('helloworld', { len: 9 })).toBe('*********d');
      expect(hideString('helloworld', { start: 0, len: 9 })).toBe('*********d');

      expect(hideString('👨‍👨‍👧‍👦helloworld👨‍👨‍👧‍👦', { start: 1, len: 10 })).toBe('👨‍👨‍👧‍👦**********👨‍👨‍👧‍👦');
      expect(hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { start: 1, len: 11 })).toBe('👨‍👨‍👧‍👦***********👨‍👨‍👧‍👦');

      expect(hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { start: 1, len: 11, replacementLen: 1 })).toBe(
        '👨‍👨‍👧‍👦*👨‍👨‍👧‍👦',
      );
    });
    it('len,end', () => {
      expect(hideString('helloworld')).toBe('**********');
      expect(hideString('helloworld', { len: 10, end: 10, replacement: '*' })).toBe('**********');

      expect(hideString('helloworld', { len: 0, end: 10 })).toBe('helloworld');

      expect(hideString('helloworld', { len: 8, end: -1 })).toBe('h********d');
      expect(hideString('helloworld', { len: 8, end: 9 })).toBe('h********d');

      expect(hideString('👨‍👨‍👧‍👦helloworld👨‍👨‍👧‍👦', { len: 10, end: -1 })).toBe('👨‍👨‍👧‍👦**********👨‍👨‍👧‍👦');
      expect(hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { len: 11, end: -1 })).toBe('👨‍👨‍👧‍👦***********👨‍👨‍👧‍👦');

      expect(hideString('👨‍👨‍👧‍👦hello👨‍👨‍👧world👨‍👨‍👧‍👦', { len: 11, end: -1, replacementLen: 1 })).toBe('👨‍👨‍👧‍👦*👨‍👨‍👧‍👦');
    });
  });
  test('getClassNames', () => {
    const getClassNames = cm.getClassNames;

    expect(getClassNames('a', 'b')).toBe('a b');
    expect(getClassNames('a', 'b', undefined)).toBe('a b');
    expect(getClassNames('a', 'b', null)).toBe('a b');
    expect(getClassNames('a', 'b')).toBe('a b');
    expect(getClassNames({ a: true, b: false, c: true })).toBe('a c');
    expect(getClassNames('a', 'b', { a: true, b: false, c: true })).toBe('a c');
    expect(getClassNames('  ', 'a', '   ', 'b', '     ', 'c', { a: true, b: '', c: true })).toBe(
      'a c',
    );
    expect(getClassNames({ a: true, b: '  ', c: '' })).toBe('a b');
    expect(getClassNames({ a: true, b: 1, c: 0 })).toBe('a b');

    expect(getClassNames({ a: true, b: 1 }, { b: 0 })).toBe('a');
  });
  test('kebabCase', () => {
    const kebabCase = cm.kebabCase;

    expect(kebabCase('a')).toBe('a');
    expect(kebabCase('A')).toBe('a');
    expect(kebabCase('aBBcde-fFF__g   h')).toBe('a-bbcde-f-ff-g-h');
    expect(kebabCase('APPStyle')).toBe('appstyle');
    expect(kebabCase('APP_Style')).toBe('app-style');
    expect(kebabCase('abc0Abc0')).toBe('abc0-abc0');

    expect(kebabCase('AUV')).toBe('auv');
    expect(kebabCase('AUV_AUV')).toBe('auv-auv');
    expect(kebabCase('Auv')).toBe('auv');
    expect(kebabCase(' Auv')).toBe('auv');
    expect(kebabCase('-Auv')).toBe('auv');
    expect(kebabCase('_Auv')).toBe('auv');

    expect(kebabCase('无hello')).toBe('无hello');
    expect(kebabCase('无 hello')).toBe('无-hello');
    expect(kebabCase('无Hello')).toBe('无-hello');
    expect(kebabCase('&^%%$Hello')).toBe('hello');
  });

  test('pascalCase', () => {
    const pascalCase = cm.pascalCase;

    expect(pascalCase('a')).toBe('A');
    expect(pascalCase('A')).toBe('A');
    expect(pascalCase('helloWorld')).toBe('HelloWorld');
    expect(pascalCase('hello-World')).toBe('HelloWorld');
    expect(pascalCase('hello-World')).toBe('HelloWorld');
    expect(pascalCase('hello World')).toBe('HelloWorld');
    expect(pascalCase('hello world')).toBe('HelloWorld');
    expect(pascalCase('Hello world')).toBe('HelloWorld');
    expect(pascalCase('Hello   world')).toBe('HelloWorld');
    expect(pascalCase('Hello___world')).toBe('HelloWorld');

    expect(pascalCase('aBBcde-f__g h')).toBe('ABbcdeFGH');
    expect(pascalCase('abc0Abc0')).toBe('Abc0Abc0');

    expect(pascalCase('Auv')).toBe('Auv');
    expect(pascalCase('a-u-v')).toBe('AUV');
    expect(pascalCase('Auv')).toBe('Auv');
    expect(pascalCase(' Auv')).toBe('Auv');
    expect(pascalCase(' auv')).toBe('Auv');
    expect(pascalCase('-Auv')).toBe('Auv');
    expect(pascalCase('_Auv')).toBe('Auv');

    expect(pascalCase('无hello')).toBe('无hello');
    expect(pascalCase('无 hello')).toBe('无Hello');
    expect(pascalCase('无Hello')).toBe('无Hello');
    expect(pascalCase('&^%%$Hello')).toBe('Hello');
  });
});
