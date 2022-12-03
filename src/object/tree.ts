import { forEachObj } from './iterate';

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

/**
 * 获取树某层的节点数 0是tree本身
 *
 * @example
 *
 * getTreeNodeLen({}, -1); // 0
 * getTreeNodeLen({}, 0); // 1
 * getTreeNodeLen({}); // 0
 * getTreeNodeLen({ a: 1, b: 2, c: 3 }); // 3
 * getTreeNodeLen({ a: 1, b: 2, c: 3, d: { d1: 123, d2: 1, d3: 123 } }); // 4
 *
 */
export function getTreeNodeLen(tree: object, nodeNumber = 1): number {
  let result = 0;
  if (typeof tree !== 'object' || tree === null || nodeNumber < 0) return result;

  function deeps(obj: object, num = 0) {
    if (nodeNumber === num++) {
      result++;
      return;
    }
    forEachObj(obj, (v) => {
      deeps(v, num);
    });
  }

  deeps(tree);
  return result;
}
