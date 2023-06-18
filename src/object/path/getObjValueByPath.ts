import type {
  DotTrim,
  RemoveStrStart,
  TransferPath,
  TransferPathOf,
  TypeOfPath,
} from '@tool-pack/types';
import { translateObjPath } from './translateObjPath';
import { isBroadlyObj } from '../../data-type';

/**
 * 通过object路径获取值
 *
 * 支持类型字面量推导，const v:number = getObjValueByPath({ a: { b: { c: 123 } } }, 'a.b.c'); v的类型是number
 *
 * @example
 *
 * // object
 * getObjValueByPath({ a: { b: { c: 123 } } }, 'a.b.c'); // 123
 * getObjValueByPath({ a: { b: { c: 123 } } }, 'a[b][c]'); // 123
 * getObjValueByPath({ a: { b: { c: '123' } } }, 'a[b].c'); // '123'
 *
 * // array
 * getObjValueByPath([[[1]]], '0.0.0'); // 1
 * getObjValueByPath([[[1]]], '[0][0][0]'); // 1
 * getObjValueByPath([[[1]]], '[0][0].0'); // 1
 *
 */
export function getObjValueByPath<
  T extends Record<string, any>,
  P extends string,
  S extends string = '',
>(
  obj: T,
  path: TransferPathOf<T, P, S>,
  objName: S = '' as S,
): TypeOfPath<T, TransferPath<DotTrim<RemoveStrStart<P, S>>>> {
  const p = translateObjPath(path, objName) as string;
  return p.split('.').reduce((init, v) => {
    if (!isBroadlyObj(init)) return undefined;
    return init[v as keyof typeof init];
  }, obj as any);
}

// getObjValueByPath({a: {b: {b_c: 123,d:'d'}}}, "a.b.b_c"); // number
// getObjValueByPath({a: {b: {c: 123}}}, "obj[a][b][c]", "obj"); // number
// getObjValueByPath({a: 123, b: {c: false}}, "obj[b][c]", "obj"); // boolean
