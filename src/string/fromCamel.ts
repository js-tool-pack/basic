/**
 * 从驼峰转其他命名格式
 *
 * @example
 *
 *  // 默认下划线分割
 * fromCamel('a'); // 'a'
 * fromCamel('A'); // 'a'
 * fromCamel('Test'); // 'test'
 * fromCamel('TEST'); // 'test'
 * fromCamel('testCamel'); // 'test_camel'
 * fromCamel('TestCamelString'); // 'test_camel_string'
 * fromCamel('TestCamelSTring'); // 'test_camel_string'
 *
 * // 自定义分割字符
 * fromCamel('TestCamelSTring', '-'); // 'test-camel-string'
 *
 * // 转大写
 * fromCamel('TestCamelSTring', '-', true); // 'TEST-CAMEL-STRING'
 *
 * @param {string} value
 * @param [delimiter='_'] 默认'_'
 * @param [toUpperCase=false] // 为true时 转为全大写的格式
 */
export function fromCamel(value: string, delimiter = '_', toUpperCase = false) {
  const res = value.replace(/([A-Z]+)/g, (_p1, p2, index) => {
    return (index > 0 ? delimiter : '') + p2.toLowerCase();
  });
  return toUpperCase ? res.toUpperCase() : res;
}
