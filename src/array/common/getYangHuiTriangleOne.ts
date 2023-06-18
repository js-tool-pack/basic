/**
 * 获取num阶杨辉三角
 *
 * @example
 *
 * getYangHuiTriangleOne(6); // [1, 5, 10, 10, 5, 1]
 * getYangHuiTriangleOne(10); // [1, 9, 36, 84, 126, 126, 84, 36, 9, 1]
 *
 * @param num 阶数
 */
export function getYangHuiTriangleOne(num: number): number[] {
  if (num < 1) return [];
  if (num === 1) return [1];
  const result: number[] = [];
  result[0] = result[1] = 1;
  for (let i = 3; i <= num; i++) {
    const prev = result.slice();
    result[0] = result[i - 1] = 1;
    for (let j = 1; j < i - 1; j++) {
      result[j] = (prev[j - 1] as number) + (prev[j] as number);
    }
  }
  return result;
}
