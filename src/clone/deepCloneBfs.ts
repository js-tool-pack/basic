import { hasOwn } from '../object';

/**
 * 对象深拷贝办法(广度优先)
 *
 * @example
 *
 * const obj = { a: [2, 3], c: 1, d: { f: 123 } };
 * const newObj = deepCloneBfs(obj);
 * // copy == obj
 * isEqual(newObj,obj); // true
 * // copy !== obj
 * obj === newObj; // false
 * // copy.a == obj.a
 * isEqual(obj.a,newObj.a); // true
 * // copy.a !== obj.a
 * obj.a === newObj.a; // false
 *
 */
export function deepCloneBfs<T>(target: T): T {
  if (typeof target !== 'object' || !target) return target;
  type QueItem = [string, any, any];
  const result: any = new (target as any).constructor();
  function getChildren(tar: object, parent: any) {
    for (const k in tar) {
      if (!hasOwn(tar, k)) continue;
      queue.push([k, tar[k], parent]);
    }
  }
  const queue: QueItem[] = [];
  getChildren(target as any, result);
  while (queue.length) {
    const [k, v, parent] = queue.shift() as QueItem;
    const type = typeof v;
    // console.log(type);
    if (type !== 'object' || v === null) {
      parent[k] = v;
      continue;
    }
    if (parent[k] === undefined) {
      parent[k] = new v.constructor();
    }
    getChildren(v, parent[k]);
  }
  return result;
}
