import { forEachObj } from '../object';

/**
 * DynamicEnum 意思是动态的枚举，也可以把他叫做 MapProxy
 */
export class DynamicEnum<K, V> {
  private valueKeyMap: Map<V, K> = new Map();
  constructor(private originMap: Map<K, V>) {
    this.updateValueKeyMap();
  }
  static createByObj(obj: object): DynamicEnum<string, any> {
    const map = new Map<string, any>();
    forEachObj(obj, (v, k): void => {
      map.set(k, v);
    });
    return new DynamicEnum(map);
  }
  private updateValueKeyMap(): void {
    const map = new Map<V, K>();
    this.originMap.forEach((value, key) => {
      map.set(value, key);
    });
    this.valueKeyMap = map;
  }
  set(key: K, value: V): void {
    if (!this.originMap.has(key)) {
      this.originMap.set(key, value);
      this.valueKeyMap.set(value, key);
      return;
    }
    const originValue = this.originMap.get(key);
    if (originValue === value) return;
    this.originMap.set(key, value);
    this.updateValueKeyMap();
  }
  setOrSwap(key: K, value: V): void {
    const originValue = this.originMap.get(key);
    const originKey = this.getKeyByValue(value);
    if (originKey !== undefined && originValue !== undefined) {
      this.originMap.set(originKey, originValue);
    }
    this.set(key, value);
  }
  setKeyByValue(value: V, key: K): void {
    const originKey = this.valueKeyMap.get(value);
    if (originKey === undefined) return;
    this.originMap.delete(originKey);
    this.originMap.set(key, value);
    this.updateValueKeyMap();
  }
  map<T>(callbackFn: (value: V, key: K, map: Map<K, V>) => T): T[] {
    const result: T[] = [];
    this.originMap.forEach((value, key, map) => result.push(callbackFn(value, key, map)));
    return result;
  }
  deleteByValue(value: V): boolean {
    const key = this.getKeyByValue(value);
    if (!key) return false;
    return this.delete(key);
  }
  delete(key: K): boolean {
    const res = this.originMap.delete(key);
    res && this.updateValueKeyMap();
    return res;
  }
  forEach(callbackFn: (value: V, key: K, map: Map<K, V>) => void): void {
    this.originMap.forEach(callbackFn);
  }
  getKeyByValue(value: V): undefined | K {
    return this.valueKeyMap.get(value);
  }
  clear(): void {
    this.originMap.clear();
    this.valueKeyMap.clear();
  }
  get(key: K): undefined | V {
    return this.originMap.get(key);
  }
  get size(): number {
    return this.originMap.size;
  }
}
