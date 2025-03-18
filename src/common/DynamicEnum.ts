import { forEachObj } from '../object';

/**
 * DynamicEnum 意思是动态的枚举，也可以把他叫做 MapProxy
 */
export class DynamicEnum {
  private valueKeyMap: Map<unknown, unknown> = new Map();
  constructor(private originMap: Map<unknown, unknown>) {
    this.updateValueKeyMap();
  }
  static createByObj(obj: object): DynamicEnum {
    const map = new Map();
    forEachObj(obj, (v, k): void => {
      map.set(k, v);
    });
    return new DynamicEnum(map);
  }
  private updateValueKeyMap(): void {
    const map = new Map<unknown, unknown>();
    this.originMap.forEach((value, key) => {
      map.set(value, key);
    });
    this.valueKeyMap = map;
  }
  set(key: unknown, value: unknown): void {
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
  setKeyByValue(value: unknown, key: unknown) {
    const originKey = this.valueKeyMap.get(value);
    if (originKey === undefined) return;
    this.originMap.delete(originKey);
    this.originMap.set(key, value);
    this.updateValueKeyMap();
  }
  deleteByValue(value: unknown): boolean {
    const key = this.getKeyByValue(value);
    if (!key) return false;
    return this.delete(key);
  }
  forEach(callbackFn: (value: unknown, key: unknown, map: Map<unknown, unknown>) => void): void {
    this.originMap.forEach(callbackFn);
  }
  delete(key: unknown): boolean {
    const res = this.originMap.delete(key);
    res && this.updateValueKeyMap();
    return res;
  }
  getKeyByValue(value: unknown): unknown {
    return this.valueKeyMap.get(value);
  }
  clear(): void {
    this.originMap.clear();
    this.valueKeyMap.clear();
  }
  get(key: unknown): unknown {
    return this.originMap.get(key);
  }
  get size(): number {
    return this.originMap.size;
  }
}
