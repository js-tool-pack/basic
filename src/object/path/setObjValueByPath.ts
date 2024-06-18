import type {
  RemoveStrStart,
  TransferPathOf,
  TransferPath,
  TypeOfPath,
  DotTrim,
} from '@tool-pack/types';
import { translateObjPath } from './translateObjPath';
import { isBroadlyObj } from '../../data-type';
import { hasOwn } from '../common';

/**
 * 通过object路径设置值 如果路径中不存在则会自动创建对应的对象
 *
 * 支持类型推导检测
 *
 * @example
 *
 * setObjValueByPath({ a: { b: { c: 123 } } }, 'obj[a][b][c]', 333, undefined, 'obj'); // {a: { b: { c: 333 } }}
 * setObjValueByPath({ a: { b: { c: 123 } } }, 'obj[a][b][c]', true as any, undefined, 'obj'); // {a: { b: { c: true } }}
 *
 * @param obj 对象
 * @param path 路径
 * @param value 设置值
 * @param onExist 当要改动位置已经有值时的回调
 * @param [objName = ""] 对象名
 */
export function setObjValueByPath<
  T extends object,
  P extends string,
  S extends string = '',
  NO_START extends string = DotTrim<RemoveStrStart<P, S>>,
  Path extends string = TransferPath<NO_START>,
>(
  obj: T,
  path: TransferPathOf<T, P, S>,
  value: TypeOfPath<T, Path>,
  onExist: SetObjValueByPathOnExist = (_a, b): any => b,
  objName: S = '' as S,
): T {
  const p = translateObjPath(path, objName) as string;
  const split = p.split('.');
  const end = split.length - 1;
  split.reduce(
    ([init, currentPath], key, index) => {
      currentPath = currentPath + (currentPath ? '.' + key : key);
      if (index === end) {
        if (hasOwn(init, key)) {
          value = onExist(init[key], value, true, currentPath);
        }
        init[key] = value;
        return [init[key], currentPath] as any;
      }
      if (!isBroadlyObj(init[key])) {
        init[key] = hasOwn(init, key) ? onExist(init[key], {}, false, currentPath) : {};
      }
      return [init[key], currentPath];
    },
    [obj, ''] as [Record<string, any>, string],
  );
  return obj;
}

type SetObjValueByPathOnExist = (a: any, b: any, isEnd: boolean, path: string) => any;
