/**
 * 根据正弦定理(a/sinA = b/sinB = c/sinC)获取对应边长
 *
 * @example
 *
 * getBorderWidthBySin(1, 45, 90).toFixed(2); // Math.sqrt(2).toFixed(2)
 * getBorderWidthBySin(1, 45, 45); // 1
 *
 * @param a a边
 * @param angleA 角A
 * @param angleB 要获取的边长对应的角度
 */
export function getBorderWidthBySin(a: number, angleA: number, angleB: number) {
  // 角度化弧度
  const rad = Math.PI / 180;
  const radA = rad * angleA;
  const radB = rad * angleB;
  const resA = a / Math.sin(radA);
  return resA * Math.sin(radB);
}
