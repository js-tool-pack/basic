/**
 * 创建一个 event bus
 *
 * 基于事件发布订阅的 event bus.
 * 该方式区别于传统的 event bus 可以监听多个事件，该方式是点对点事件监听的。
 * 比传统的 EventBus 解决了类型安全以及隐式依赖的问题。
 * 其实更好的方式是用 RxJS 的各种 Subject 作为 EventBus，但是仅仅只是用于 EventBus 的话有点杀鸡焉用牛刀，所以该方式可以作为下位替代。
 *
 * @example
 * // 创建事件，预先声明事件
 * const event = createEventBus<{ a: number; b: number }>();
 * // 事件监听
 * const off = event.on((v, off) => {
 *   console.log(v.a, v.b);
 *   off(); // 移除事件监听，相当于一次性事件；跟外面 on 返回的 off 是一样的
 * });
 * // 触发事件
 * event.emit({ a: 1, b: 2 });
 * // 清理事件监听
 * off();
 * // 清理所有事件监听
 * event.clear();
 */
export function createEventBus<T = never>() {
  type Off = () => void;
  type Listener = (payload: T, off: Off) => void;
  const listeners: Listener[] = [];
  return {
    /**
     * 添加事件监听，接收数据
     */
    on(listener: Listener): Off {
      listeners.push(listener);
      return () => off(listener);
    },
    /**
     * 触发事件，传递数据
     */
    emit(payload: T): void {
      // listeners.slice() 避免边遍历边 off 时遍历缺漏
      listeners.slice().forEach((listener): void => {
        // 后面的 listener 有可能被前面的 listener off 掉了
        if (!listeners.includes(listener)) return;
        listener(payload, () => off(listener));
      });
    },
    /**
     * 清理所有事件监听
     */
    clear(): void {
      listeners.length = 0;
    },
  } as const;

  function off(listener: Listener): void {
    const index = listeners.indexOf(listener);
    if (index === -1) return;
    listeners.splice(index, 1);
  }
}
