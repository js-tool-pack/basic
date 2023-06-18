import { isNaN } from '../../data-type';

/**
 * 数组去重函数
 *
 * @example
 *
 * unique([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1]); // [1, 2, 3, 4]
 * unique([1, 2, 3, 4]); // [1, 2, 3, 4]
 * unique([NaN, null, undefined, '']); // [NaN, null, undefined, '']
 * unique([undefined, undefined, '']); // [undefined, '']
 * unique([NaN, NaN]); // [NaN]
 * unique([NaN, NaN], (a, b) => Number.isNaN(a) && Number.isNaN(b)); // [NaN]
 * const a = { value: 1 };
 * const b = { value: 2 };
 * const c = { value: 3 };
 * const d = { value: 2 };
 * unique([a, b, c, d]); // [a, b, c, d]
 * unique([]); // []
 * unique([a, b, c, d], (v1, v2) => v1.value === v2.value); // [a, b, c]
 *
 */
export function unique<T>(target: T[], isRepeatFn?: (value: T, value2: T) => boolean) {
  if (!target.length) return target;
  const fn = isRepeatFn || ((v1, v2) => v1 === v2 || (isNaN(v1) && isNaN(v2)));
  const result = [target[0] as T];
  for (let i = 1, len = target.length; i < len; i++) {
    const item = target[i] as T;
    if (result.some((resItem) => fn(resItem, item))) continue;
    result.push(item);
  }
  return result;
}
