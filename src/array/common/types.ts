/**
 * insertToArray函数回调参数类型声明
 */
export interface InsertToArrayToCBOptions<T = unknown> {
  index: number;
  inserts: T[];
  array: T[];
  insert: T;
  item: T;
}
