import { CaseSplitRegExp } from './regexp';

/**
 * 其他变量命名风格转蛇形
 *
 * 跟kebabCase除了分隔符不同，其余基本一样
 *
 * @example
 *
 * kebabCase('aBBcde-fFF__g   h'); // 'a_bbcde_f_ff_g_h'
 * kebabCase('APPStyle'); 'appstyle'
 * kebabCase('APP_Style'); 'app_style'
 * kebabCase('abc0Abc0'); // 'abc0_abc0'
 * kebabCase('AUV'); // 'auv'
 * kebabCase(' Auv'); // 'auv'
 *
 */
export function snakeCase(value: string): string {
  if (!value) return value;
  return value
    .split(CaseSplitRegExp)
    .map((w) => w.toLowerCase())
    .filter(Boolean)
    .join('_');
}
