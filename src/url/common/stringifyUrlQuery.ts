import { forEachObj, reduceObj } from '../../object';

/**
 * 把对象转成url query
 *
 * @example
 *
 * u.stringifyUrlQuery({ a: 1, b: 2, c: [3, 33], d: { f: '5', g: '6' } }); // 'a=1&b=2&c[0]=3&c[1]=33&d[f]=5&d[g]=6'
 *
 */
export function stringifyUrlQuery(query: { [k: string]: any }): string {
  return reduceObj(
    query,
    (initValue, v, k) => {
      if (v === undefined) return initValue;
      if (typeof v === 'object') {
        forEachObj(v, (val, key) => {
          if (val === undefined) return;
          initValue.push(`${k}[${key as string}]=${encodeURIComponent(val)}`);
        });
      } else {
        initValue.push(`${k}=${encodeURIComponent(v)}`);
      }
      return initValue;
    },
    [] as string[],
  ).join('&');
}
