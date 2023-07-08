import { splitByCases } from './splitByCases';

/**
 * 其他变量命名风格转小写加中划线
 *
 * @example
 *
 * kebabCase('aBBcde-fFF__g   h'); // 'a-bbcde-f-ff-g-h'
 * kebabCase('APPStyle'); 'appstyle'
 * kebabCase('APP_Style'); 'app-style'
 * kebabCase('abc0Abc0'); // 'abc0-abc0'
 * kebabCase('AUV'); // 'auv'
 * kebabCase(' Auv'); // 'auv'
 *
 */
export function kebabCase(value: string): string {
  if (!value) return value;

  return splitByCases(value)
    .map((v) => v.toLowerCase())
    .join('-');
}
