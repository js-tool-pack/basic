/**
 * 把错误的数据转正  from number-precision
 *
 * @example
 *
 * 1.0000000000041083; // 1.0000000000041083
 * strip(1.0000000000041083); // 1
 *
 * 1.0000000000001563; // 1.0000000000001563
 * strip(1.0000000000001563); // 1
 *
 * 1.0000000000001563; // 1.0000000000001563
 * strip(1.0000000000001563); // 1
 *
 * strip(0.09999999999999998); // 0.1
 *
 */
export function strip(num: number, precision = 12): number {
  return +parseFloat(num.toPrecision(precision));
}

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

/**
 * 获取小数点后面数字的长度,支持科学计数法
 *
 * from number-precision
 *
 * @example
 *
 * // 数字
 * getNumberLenAfterDot(0.12345667); // 8
 * getNumberLenAfterDot(12345); // 0
 *
 * // 字符串
 * getNumberLenAfterDot('0.123456789'); // 9
 * getNumberLenAfterDot('abc'); // 0
 *
 * // 科学计数法
 * getNumberLenAfterDot(1.123e5); // 0
 * getNumberLenAfterDot(1.123e2); // 1
 * getNumberLenAfterDot(1.123e2); // 1
 * getNumberLenAfterDot(1e2); // 0
 * getNumberLenAfterDot(1e-2); // 2
 *
 */
export function getNumberLenAfterDot(num: number | string): number {
  Number(1000).toPrecision();
  const eSplit = String(num).split(/[eE]/);
  const len = (eSplit[0]?.split('.')[1] || '').length - +(eSplit[1] || 0);
  return len > 0 ? len : 0;
}

/**
 * 获取两位数乘后都能为整数的数字
 *
 * @example
 *
 * getCommonPow(0.1, 0.11); // 100
 * getCommonPow(1.123e2, 0.11); // 100
 * getCommonPow(1e2, 10); // 1
 * getCommonPow(1e-2, 10); // 100
 * getCommonPow(10.1, 1.00001); // 100000
 *
 */
export function getCommonPow(a: number, b: number): number {
  const aLen = getNumberLenAfterDot(a);
  const bLen = getNumberLenAfterDot(b);
  return Math.pow(10, Math.max(aLen, bLen));
}

/**
 * @see plus
 * @see divide
 * @see times
 * @see divide
 */
export function calcArr(
  num: number,
  nums: number[],
  callback: (a: number, b: number, pow: number) => number,
): number {
  return nums.reduce<number>((a, b) => {
    const pow = getCommonPow(a, b);
    return callback(a, b, pow);
  }, num);
}

/**
 * 加法计算，直接计算有精度问题
 *
 * // 0.1 + 0.2 = 0.30000000000000004
 * 0.1 + 0.2; // 0.30000000000000004
 * plus(0.1, 0.2); // 0.3
 *
 */
export function plus(num: number, ...nums: Array<number>) {
  return calcArr(num, nums, (a, b, pow) => (a * pow + b * pow) / pow);
}

/**
 * 减法计算，直接计算有精度问题
 *
 * @example
 *
 * // 0.3 - 0.1 = 0.19999999999999998
 * 0.3 - 0.1; // 0.19999999999999998
 * minus(0.3, 0.1); // 0.2
 *
 */
export function minus(num: number, ...nums: Array<number>) {
  return calcArr(num, nums, (a, b, pow) => (a * pow - b * pow) / pow);
}

/**
 * 乘法计算，直接计算有精度问题
 *
 * @example
 *
 * // 0.2 * 0.1 = 0.020000000000000004
 * 0.2 * 0.1; // 0.020000000000000004
 * times(0.2, 0.1); // 0.02
 *
 */
export function times(num: number, ...nums: Array<number>) {
  return calcArr(num, nums, (a, b, pow) => (pow * a * (b * pow)) / (pow * pow));
}

/**
 * 除法计算，直接计算有精度问题
 *
 * @example
 *
 * // 0.3 / 0.1 = 2.9999999999999996
 * 0.3 / 0.1; // 2.9999999999999996
 * divide(0.3, 0.1); // 3
 *
 */
export function divide(num: number, ...nums: Array<number>) {
  return calcArr(num, nums, (a, b, pow) => (a * pow) / (b * pow));
}

/**
 * 安全数字
 *
 * 如果value小于min，那么返回min，如果value大于max，那么返回max，否则返回value
 *
 * @example
 *
 * getSafeNum(0); // 0
 * getSafeNum(0, 1, 100); // 1
 * getSafeNum(50, 1, 100); // 50
 * getSafeNum(101, 1, 100); // 100
 * getSafeNum(101, 1); // 101
 *
 * @param value 数字
 * @param [min=-Infinity] 默认-Infinity
 * @param [max=Infinity] 默认Infinity
 */
export function getSafeNum(value: number, min = -Infinity, max = Infinity): number {
  return Math.max(min, Math.min(value, max));
}
