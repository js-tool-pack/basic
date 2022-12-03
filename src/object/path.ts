import {
  DotTrim,
  RemoveStrStart,
  TransferPath,
  TransferPathOf,
  TypeOfPath,
} from '@tool-pack/types';
import { isBroadlyObj, typeOf } from '../data-type';
import { hasOwn } from './common';
import { reduceObj } from './iterate';

/**
 * 对象属性路径转换： obj[a] => obj.a
 *
 * @example
 * translateObjPath('a[b][c].d[e][f]'); // 'a.b.c.d.e.f'
 * translateObjPath('a.b.c.d.e.f'); // 'a.b.c.d.e.f'
 * translateObjPath('a.b.c.d.e.f', 'a'); // 'b.c.d.e.f'
 * translateObjPath('a[b][c].d.e.f', 'a\\[b\\]\\[c\\]'); // 'd.e.f'
 * translateObjPath('a.b.c.d.e.f', 'a.b.c'); // 'd.e.f'
 * translateObjPath('a[][][]'); // 'a'
 *
 * @param path 路径
 * @param [objName = ""] 对象名
 */
export function translateObjPath<P extends string, S extends string = ''>(
  path: P,
  objName: S = '' as S,
): DotTrim<TransferPath<RemoveStrStart<P, S>>> {
  let result: any = path;
  // obj[a] => obj.a
  result = result.replace(new RegExp(`^${objName}`), '');
  result = result.replace(/\[([^\]]+)]/g, '.$1');
  result = result.replace(/^\.|\[]/g, '');
  return result;
}

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

type SetObjValueByPathOnExist = (a: any, b: any, isEnd: boolean, path: string) => any;

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

/**
 * 获取object的路径数组
 *
 * @example
 *
 * getObjPathEntries({a: 1}) // => [["[a]", 1]]
 * getObjPathEntries({a: 1},"obj") // => [["obj[a]", 1]]
 *
 * @param obj 对象
 * @param [objName = ""] 对象名
 */
export function getObjPathEntries(obj: object, objName = ''): Array<[string, any]> {
  return reduceObj(
    obj,
    (init, v, k) => {
      const key = `${objName}[${k as string}]`;
      if (isBroadlyObj(v)) {
        init.push(...getObjPathEntries(v, key));
      } else {
        init.push([key, v]);
      }
      return init;
    },
    [] as Array<[string, any]>,
  );
}

// 根据路径还原整个object
export function revertObjFromPath(pathArr: string[]): object {
  function getKV(path: string): { key: string; value: string; innerKey: string } {
    const [k, value] = path.split('=').map((item) => decodeURIComponent(item)) as [string, string];
    let key = k;
    let innerKey = '';
    const reg = /\[([^[\]]*)]|\.\[?([^[\]]*)]?/g;
    if (reg.test(key)) {
      innerKey = RegExp.$1 || RegExp.$2;
      key = key.replace(reg, '');
    }
    // key = key.replace(/\[[^\[\]]*]/g, "");
    return { key, value, innerKey };
  }

  return pathArr.reduce((result, path) => {
    const { key, value, innerKey } = getKV(path);
    const resultValue = result[key];

    // no-fallthrough
    switch (typeOf(resultValue)) {
      case 'undefined':
        if (!innerKey) {
          result[key] = value;
        } else {
          const arr: any[] = [];
          arr[innerKey as any] = value;
          result[key] = arr;
        }
        break;
      case 'string':
        result[key] = [resultValue];
      // eslint-disable-next-line no-fallthrough
      case 'array':
        if (!innerKey) {
          result[key].push(value);
        } else {
          result[key][innerKey] = value;
        }
    }
    return result;
  }, {} as Record<string, any>);
}
