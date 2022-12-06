import { plus, minus, times, divide, strip } from './number';

/**
 * 链式计算
 *
 * @example
 *
 *  // 0.3 - 0.1 = 0.19999999999999998
 * CalcChain.init(0.3).minus(0.1).value; // 0.2
 * // 0.2 * 0.1 = 0.020000000000000004
 * CalcChain.init(0.2).times(0.1).value; // 0.02
 * // 0.3 / 0.1 = 2.9999999999999996
 * CalcChain.init(0.3).divide(0.1).value; // 3
 *
 * // 100 / 10 + 5 - 2 = 13
 * c.times(100).divide(10).plus(5).minus(2).value; // 13
 *
 * // 0.3 - 0.1 = 0.19999999999999998
 * CalcChain.init(0.3)['-'](0.1).value; // 0.2
 * // 0.2 * 0.1 = 0.020000000000000004
 * CalcChain.init(0.2)['*'](0.1).value; // 0.02
 * // 0.3 / 0.1 = 2.9999999999999996
 * CalcChain.init(0.3)['/'](0.1).value; // 3
 */
export class CalcChain {
  private _value!: number;

  constructor(private readonly initNumber: number) {
    this.setValue(initNumber);
  }

  // 初始化一个实例
  public static init(num: number): CalcChain {
    return new CalcChain(num);
  }

  // 加
  public ['+'](...nums: number[]): CalcChain {
    // this.calc((a, b, pow) => (a * pow + b * pow) / pow, num, others);
    this.setValue(plus(this._value, ...nums));
    return this;
  }

  public plus = this['+'];

  // 减
  public ['-'](...nums: number[]): CalcChain {
    this.setValue(minus(this._value, ...nums));
    return this;
  }

  public minus = this['-'];

  // 乘
  public ['*'](...nums: number[]): CalcChain {
    this.setValue(times(this._value, ...nums));
    return this;
  }

  public times = this['*'];

  // 除
  public ['/'](...nums: number[]): CalcChain {
    this.setValue(divide(this._value, ...nums));
    return this;
  }

  public divide = this['/'];

  // 100 - 20 * 2; <==>  Calc.create(20)["*"](2).before(100, "-")
  public by(num: number, calcLabel: '+' | '-' | '*' | '/') {
    const value = this._value;
    this.setValue(num);
    this[calcLabel](value);
    return this;
  }

  private setValue(value: number) {
    this._value = value;
  }

  // 获取当前值
  public get value(): number {
    return strip(this._value);
  }

  // 设置当前值
  public set value(num) {
    this.setValue(num);
  }

  // 重置为初始值
  public reset(): CalcChain {
    this._value = this.initNumber;
    return this;
  }

  valueOf(): number {
    return this._value;
  }
}
