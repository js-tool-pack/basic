/**
 * 首字母大写
 *
 * @example
 *
 * capitalize('A'); // 'A'
 * capitalize('1'); // '1'
 * capitalize('ab'); // 'Ab'
 * capitalize('Ab'); // 'Ab'
 * capitalize('aa'); // 'Aa'
 * capitalize('AAA')); // 'Aaa';
 * capitalize(''); // ''
 *
 */
export function capitalize<S extends string>(value: S): Capitalize<S> {
  if (!value.length) return value as any;
  const first = value[0] as string;
  return `${first.toUpperCase()}${value.substring(1).toLowerCase()}` as any;
}
