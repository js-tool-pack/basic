import { forEachObj } from '../iterate';

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
