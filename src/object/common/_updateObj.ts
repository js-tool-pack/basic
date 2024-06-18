import { forEachRight } from '../../array';
import { hasOwn } from './hasOwn';

/**
 * 内部更新对象函数
 */
export function _updateObj<T extends object>(target: T, others: object[], k: keyof T): void {
  // 从后往前查起
  forEachRight(others, (item): false | void => {
    if (item && hasOwn(item, k)) {
      target[k] = item[k];
      // 某个对象有这个key，那么就不再往前查
      return false;
    }
  });
}
