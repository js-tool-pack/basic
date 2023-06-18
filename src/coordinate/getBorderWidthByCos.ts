/**
 * 根据余弦定理(c^2 = a^2 + b^2 - 2 * a * b * cosA)获取任意边长
 *
 * @example
 *
 * getBorderWidthByCos(3, 4, 90); // 5
 * getBorderWidthByCos(1, 1, 90).toFixed(2); // Math.sqrt(2).toFixed(2)
 *
 * @param a a边
 * @param b b边
 * @param angle 要获取的边长对应的角度
 */
export function getBorderWidthByCos(a: number, b: number, angle: number) {
  // 角度化弧度
  const C = (angle * Math.PI) / 180;
  const c2 = a ** 2 + b ** 2 - 2 * a * b * Math.cos(C);
  return Math.sqrt(c2);
}
