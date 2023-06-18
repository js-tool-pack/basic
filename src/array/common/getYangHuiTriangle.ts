/**
 * 获取num阶杨辉三角
 *
 * @example
 *
 * // [1],
 * // [1, 1],
 * // [1, 2, 1],
 * // [1, 3, 3, 1],
 * // [1, 4, 6, 4, 1],
 * // [1, 5, 10, 10, 5, 1]
 * getYangHuiTriangle(6);
 *
 * @param num 阶数
 */
export function getYangHuiTriangle(num: number): number[][] {
  const result: number[][] = [[1]];
  if (num === 1) return result;
  result.push([1, 1]);
  for (let i = 3; i <= num; i++) {
    const cur: number[] = [];
    const prev = result[result.length - 1] as number[];
    cur[0] = cur[i - 1] = 1;
    for (let k = 1; k < i - 1; k++) {
      cur[k] = (prev[k - 1] as number) + (prev[k] as number);
    }
    result.push(cur);
  }
  return result;
}
