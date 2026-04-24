/**
 * 状态工具
 *
 * 一个简单的状态判断封装，
 * 主要是写代码时总要把状态从===判断改成[state1,state2,...].includes(state),
 * 而封装后，我只要把 is 方法改为 in 然后添加参数就行，
 * 而且 in 方法预设的类型约束比现写数组的要好(可能要再写一遍约束)
 *
 *  @example
 *  enum Color {
 *     RED,
 *     BLUE,
 *     GREEN,
 *  }
 *
 *  const state = new StateTool(Color.RED);
 *  state.is(Color.RED); // return true
 *  state.in(Color.BLUE, Color.RED, Color.GREEN) // return true
 *
 *  state.value = Color.GREEN;
 *  state.is(Color.GREEN); // return true
 *  state.value // Color.GREEN
 *
 *  // 必须指定类型
 *  const state2 = new StateTool<Color | null>(null);
 *  state2.value // null
 *  state2.value = Color.RED;
 */
export class StateTool<T> {
  constructor(private state: T) {}

  in(...status: T[]): boolean {
    return status.includes(this.state);
  }
  is(state: T): boolean {
    return this.state === state;
  }
  // 为什么不直接在构造函数内把参数设置为 public value: T
  // 是因为后续如果要继承这个类给 set 或者 get 加个过滤的话，就要另外起一个名字，不够灵活
  set value(state: T) {
    this.state = state;
  }
  get value(): T {
    return this.state;
  }
}
