/**
 * 科学计数法转普通小数
 *
 * @note 不能转太大的数 比如大于Number.MAX_SAFE_INTEGER
 *
 * @example
 *
 * toNonExponential(1e2); // '100'
 * toNonExponential(0.0000001); // '0.0000001'
 * toNonExponential(0.0000000001); // '0.0000000001'
 *
 * const num = 100_000_000_000_000_000_000_000;
 * num.toString(); // '1e+23'
 * num > Number.MAX_SAFE_INTEGER; // true
 * toNonExponential(num); // '1e+23'
 *
 * const num2 = (1_000_000_000_000_000).toExponential();
 * num2.toString(); // '1e+15'
 * +num2 > Number.MAX_SAFE_INTEGER; // false
 * toNonExponential(+num2); // '1000000000000000'
 *
 */
export function toNonExponential(num: number): string {
  // toExponential 转为科学计数法
  // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  const sNum = String(num);
  const m = sNum.match(/\d(?:\.(\d*))?e([+-]\d+)/);
  if (num > Number.MAX_SAFE_INTEGER || !m || m.length < 3) return sNum;
  return num.toFixed(Math.max(0, (m[1] || '').length - Number(m[2])));
}
