import { getReversedObj } from '../object';

/**
 * 创建一个enum对象，给非ts环境使用
 *
 * @example
 * // object
 * createEnum({ a: 'aa', b: 'bb' }); // { a: 'aa', b: 'bb', aa: 'a', bb: 'b' }
 * createEnum({ a: 1, b: 2 }); // { a: 1, b: 2, 1: 'a', 2: 'b' }
 *
 * // array
 * createEnum([0, 1]); // { '0': '0', '1': '1' }
 * createEnum(['a', 'b']); // { a: '0', b: '1', 0: 'a', 1: 'b' }
 *
 */
export function createEnum<T extends object, K extends keyof T>(
  obj: T,
): Readonly<
  T & {
    [k: string]: K;
  }
> {
  /* const res: any = {};
     for (let k in obj) {
         if (res.hasOwnProperty(k)) throw new Error("key multiple");
         res[res[k] = obj[k]] = k;
     }
      Object.freeze(res); // freeze值不可变
     // Object.seal(result); // seal值可以变
     return res;*/
  return Object.freeze(Object.assign({}, obj, getReversedObj(obj as any))) as any;
}
