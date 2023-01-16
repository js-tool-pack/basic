import * as Num from '../src/number';
import { Tuple } from '@tool-pack/types';
const {
  strip,
  getNumberLenAfterDot,
  getCommonPow,
  toNonExponential,
  getSafeNum,
  plus,
  minus,
  times,
  divide,
  numToFixed,
  forEachNum,
  forEachNumRight,
  numberToChinese,
  chineseToNumber,
} = Num;
describe('number', function () {
  test('strip', () => {
    expect(1.0000000000041083).toBe(1.0000000000041083);
    expect(strip(1.0000000000041083)).toBe(1);

    expect(1.0000000000001563).toBe(1.0000000000001563);
    expect(strip(1.0000000000001563)).toBe(1);

    expect(1.0000000000001563).toBe(1.0000000000001563);
    expect(strip(1.0000000000001563)).toBe(1);

    expect(0.09999999999999998).toBe(0.09999999999999998);
    expect(strip(0.09999999999999998)).toBe(0.1);

    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    expect(strip(20000000000.222222222)).not.toBe(20000000000.222222222);
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    expect(20000000000.222222222).toBe(20000000000.222222222);
    // 不够精准，js无法表示那么长的数据,或许改考虑用bigint
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    expect((20000000000.222222222).toString()).toBe('20000000000.22222');
  });
  test('getNumberLenAfterDot', () => {
    // 数字
    expect(getNumberLenAfterDot(0.12345667)).toBe(8);
    expect(getNumberLenAfterDot(12345)).toBe(0);

    // 字符串
    expect(getNumberLenAfterDot('0.123456789')).toBe(9);
    expect(getNumberLenAfterDot('abc')).toBe(0);

    // 科学计数法
    expect(getNumberLenAfterDot(1.123e5)).toBe(0);
    expect(getNumberLenAfterDot(1.123e2)).toBe(1);
    expect(getNumberLenAfterDot(1.123e2)).toBe(1);
    expect(getNumberLenAfterDot(1e2)).toBe(0);
    expect(getNumberLenAfterDot(1e-2)).toBe(2);
  });
  test('getCommonPow', () => {
    expect(getCommonPow(0.1, 0.11)).toBe(100);
    expect(getCommonPow(1.123e2, 0.11)).toBe(100);
    expect(getCommonPow(1e2, 10)).toBe(1);
    expect(getCommonPow(1e-2, 10)).toBe(100);
    expect(getCommonPow(10.1, 1.00001)).toBe(100000);
  });
  test('toNonExponential', () => {
    expect(toNonExponential(1e2)).toBe('100');
    expect(toNonExponential(0.0000001)).toBe('0.0000001');
    expect(toNonExponential(0.0000000001)).toBe('0.0000000001');

    const num = 100_000_000_000_000_000_000_000;
    expect(num.toString()).toBe('1e+23');
    expect(num > Number.MAX_SAFE_INTEGER).toBe(true);
    expect(toNonExponential(num)).toBe('1e+23');

    const num2 = (1_000_000_000_000_000).toExponential();
    expect(num2.toString()).toBe('1e+15');
    expect(+num2 > Number.MAX_SAFE_INTEGER).toBe(false);
    expect(toNonExponential(+num2)).toBe('1000000000000000');
  });

  test('plus', () => {
    // 0.1 + 0.2 = 0.30000000000000004
    expect(0.1 + 0.2).toBe(0.30000000000000004);
    expect(plus(0.1, 0.2)).toBe(0.3);
  });
  test('minus', () => {
    // 0.3 - 0.1 = 0.19999999999999998
    expect(0.3 - 0.1).toBe(0.19999999999999998);
    expect(minus(0.3, 0.1)).toBe(0.2);
  });
  test('times', () => {
    // 0.2 * 0.1 = 0.020000000000000004
    expect(0.2 * 0.1).toBe(0.020000000000000004);
    expect(times(0.2, 0.1)).toBe(0.02);
  });
  test('divide', () => {
    // 0.3 / 0.1 = 2.9999999999999996
    expect(0.3 / 0.1).toBe(2.9999999999999996);
    expect(divide(0.3, 0.1)).toBe(3);
  });

  test('getSafeNum', () => {
    expect(getSafeNum(0)).toBe(0);
    expect(getSafeNum(0, 1, 100)).toBe(1);
    expect(getSafeNum(50, 1, 100)).toBe(50);
    expect(getSafeNum(101, 1, 100)).toBe(100);
    expect(getSafeNum(101, 1)).toBe(101);
  });
  test('numToFixed', () => {
    expect((0).toFixed(1)).toEqual('0.0');
    expect(numToFixed(0, 1)).toBe('0.0');
    expect(numToFixed(0, 1, true)).toBe('0.0');
    expect((0).toFixed(6)).toEqual('0.000000');
    expect(numToFixed(0, 6)).toBe('0.000000');
    expect(numToFixed(0, 6, true)).toBe('0.000000');

    // Number.prototype.toFixed自带四舍五入
    expect((0.45).toFixed(1)).toBe('0.5');
    // numToFixed默认使用四舍五入，跟Number.prototype.toFixed保持一致
    expect(numToFixed(0.45, 1)).toBe('0.5');
    // 关闭四舍五入
    expect(numToFixed(0.45, 1, false)).toBe('0.4');

    expect((1.45).toFixed(1)).toBe('1.4');
    expect(numToFixed(1.45, 1, false)).toBe('1.4');
    expect(numToFixed(1.45, 1)).toBe('1.5');

    expect((1).toFixed(2)).toBe('1.00');
    expect(numToFixed(1, 2)).toBe('1.00');
    expect(numToFixed(1, 2, false)).toBe('1.00');

    expect((1.45).toFixed()).toBe('1');
    expect(numToFixed(1.45)).toBe('1');
    expect(numToFixed(1.45, undefined, false)).toBe('1');

    expect(0.5 + 0.07).not.toBe(0.57);
    expect((0.5 + 0.07).toFixed(2)).toBe('0.57');
    expect(numToFixed(0.5 + 0.07, 2)).toBe('0.57');
    expect(numToFixed(0.5 + 0.07, 5)).toBe('0.57000');

    expect(() => {
      (0.1).toFixed(-1);
    }).toThrowError();
    expect(() => {
      numToFixed(0.1, -1);
    }).toThrowError();
    expect(() => {
      (0.1).toFixed(101);
    }).toThrowError();
    expect(() => {
      numToFixed(0.1, 101);
    }).toThrowError();

    // const f = fn(0.1, 100);
    // expect(0.1.toFixed(100)).toBe(f)
  });
  test('forEachByLen', () => {
    const arr: number[] = [];
    forEachNum(3, (index) => arr.push(index));
    expect(arr).toEqual([0, 1, 2]);
    forEachNum(7, (index) => arr.push(index));
    expect(arr.length).toEqual(10);
    forEachNum(3, (index): void | false => {
      arr.push(index);
      if (index === 1) return false;
    });
    expect(arr).toEqual([0, 1, 2, 0, 1, 2, 3, 4, 5, 6, 0, 1]);
  });
  test('forEachByLenRight', () => {
    const arr: number[] = [];
    forEachNumRight(3, (index) => arr.push(index));
    expect(arr).toEqual([0, 1, 2].reverse());
    forEachNumRight(7, (index) => arr.push(index));
    expect(arr.length).toEqual(10);
    forEachNumRight(3, (index): void | false => {
      arr.push(index);
      if (index === 1) return false;
    });
    expect(arr).toEqual([...[0, 1, 2].reverse(), ...[0, 1, 2, 3, 4, 5, 6].reverse(), 2, 1]);
  });

  test('numberToChinese', () => {
    expect(numberToChinese(123)).toBe('一百二十三');
    expect(numberToChinese(1)).toBe('一');
    expect(numberToChinese(11)).toBe('十一');
    expect(numberToChinese(21)).toBe('二十一');
    expect(numberToChinese(101)).toBe('一百零一');
    expect(numberToChinese(111)).toBe('一百一十一');
    expect(numberToChinese(1001)).toBe('一千零一');
    expect(numberToChinese(1_2345)).toBe('一万二千三百四十五');
    expect(numberToChinese(2345_6789)).toBe('二千三百四十五万六千七百八十九');
    expect(numberToChinese(1_2345_6789)).toBe('一亿二千三百四十五万六千七百八十九');
    expect(numberToChinese(1_0345_6789)).toBe('一亿零三百四十五万六千七百八十九');
  });

  test('chineseToNumber', () => {
    expect(chineseToNumber('一')).toBe(1);
    expect(chineseToNumber('十一')).toBe(11);
    expect(chineseToNumber('九十一')).toBe(91);
    expect(chineseToNumber('一百九十九')).toBe(199);
    expect(chineseToNumber('五千一百九十九')).toBe(5199);
    expect(chineseToNumber('一万零一')).toBe(10001);
    expect(chineseToNumber('一万零一十')).toBe(10010);
    expect(chineseToNumber('一万零一十三')).toBe(10013);
    expect(chineseToNumber('一万零一十三')).toBe(10013);
    expect(chineseToNumber('十万零一十三')).toBe(100013);
    expect(chineseToNumber('二百一十万零一十三')).toBe(2100013);
    expect(chineseToNumber('一千二百一十万零一十三')).toBe(12100013);
    expect(chineseToNumber('一千二百一十万零一')).toBe(12100001);
    expect(chineseToNumber('一亿零二百一十万零一十三')).toBe(102100013);
    expect(chineseToNumber('一亿二千三百四十五万六千七百八十九')).toBe(123456789);
    expect(chineseToNumber('十一亿零二百一十万零一十三')).toBe(1102100013);

    const sbq = ['拾', '佰', '仟'];
    const units = ['', ...sbq, '萬', ...sbq, '亿'];
    const numbers: Tuple<string, 10> = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    // 千和百未定义
    expect(() =>
      chineseToNumber('壹亿贰仟叁佰肆拾伍萬陆千柒百捌拾玖', { numbers, units }),
    ).toThrow();
    expect(chineseToNumber('壹亿贰仟叁佰肆拾伍萬陆仟柒佰捌拾玖', { numbers, units })).toBe(
      123456789,
    );
  });
});
