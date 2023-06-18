import { forEachObj } from '../object';

/**
 * 跟 vue 的条件 className 语法类似
 *
 * @example
 *
 * ```ts
 * // string | undefined | null
 * getClassNames('a', 'b'); // 'a b'
 * getClassNames('a', 'b', undefined); // 'a b'
 * getClassNames('a', 'b', null); // 'a b'
 *
 * // object
 * getClassNames({ a: true, b: false, c: true }); // 'a c'
 * getClassNames({ a: true, b: '  ', c: '' }); // 'a b'
 * getClassNames({ a: true, b: 1, c: 0 }); // 'a b'
 *
 * // string & object
 * getClassNames('a', 'b', { a: true, b: false, c: true }); // 'a c'
 *
 * // clean multi space
 * getClassNames(' ', '    ', { a: true, b: false, c: true }); // 'a c'
 * ```
 *
 * @param classes 支持字符串和对象类型
 */
export function getClassNames(
  ...classes: Array<string | undefined | null | Record<string, unknown>>
): string {
  const classNames: Record<string, boolean> = {};
  const handleObjClasses = (obj: Record<string, unknown>): void => {
    forEachObj(obj, (v, k): void => {
      if (v) classNames[k] = true;
      else delete classNames[k];
    });
  };
  classes.forEach(
    (item) =>
      item && (typeof item === 'string' ? (classNames[item] = true) : handleObjClasses(item)),
  );
  return Object.keys(classNames).join(' ').trim().replace(/\s+/g, ' ');
}
