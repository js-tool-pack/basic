import { forEachObj } from '../iterate';

/**
 * 获取object树的最大层数 tree是object的话，tree就是层数1
 *
 * @example
 *
 * getTreeMaxDeep({}); // 1
 * getTreeMaxDeep({ a: 1 }); // 2
 * getTreeMaxDeep(null as any); // 0
 * getTreeMaxDeep({ a: { b: 1 } }); // 3
 *
 */
export function getTreeMaxDeep(tree: object): number {
  function deeps(obj: object, num = 0): number {
    if (typeof tree !== 'object' || tree === null) return num;
    const arr: number[] = [++num];
    forEachObj(obj, (v) => {
      arr.push(deeps(v, num));
    });
    return Math.max(...arr);
  }
  return deeps(tree);
}
