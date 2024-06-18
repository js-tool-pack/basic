import type { RemoveStrStart, TransferPath, DotTrim } from '@tool-pack/types';

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
