/**
 * insertToArray函数回调参数类型声明
 */
export interface InsertToArrayToCBOptions<T = unknown> {
  item: T;
  index: number;
  array: T[];
  inserts: T[];
  insert: T;
}
