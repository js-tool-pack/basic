import { reduceObj } from '../iterate';
import { isBroadlyObj } from '../../data-type';

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
