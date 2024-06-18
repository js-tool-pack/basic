import { cloneFunction, deepCloneBfs, deepClone } from '../src/clone';
import { hasOwn } from '../src/object';

describe('clone', function () {
  test('cloneFunction', () => {
    // 复制普通函数
    function test(a: number, b: number) {
      return a + b;
    }

    expect(cloneFunction(test)(50, 50)).toBe(100);

    // 复制箭头函数
    const test2 = (a: number, b: number) => a + b;
    expect(cloneFunction(test2)(50, 50)).toBe(100);

    // 复制匿名函数
    expect(
      cloneFunction(function (a: number, b: number) {
        return a + b;
      })(50, 50),
    ).toBe(100);

    // 复制非函数
    expect(cloneFunction(1 as any)).toBe(1);

    // ---------- 以上复制正常运行 ----------

    // 复制对象方法
    const obj: any = {
      fn3: function () {
        return ++this.c;
      },
      fn1() {
        return ++this.a;
      },
      fn2: () => ++obj.b,
      a: 1,
      b: 1,
      c: 1,
    };
    obj.clone1 = cloneFunction(obj.fn1);
    expect(obj.fn1()).toBe(2);
    expect(obj.clone1()).toBe(3);

    obj.clone2 = cloneFunction(obj.fn2);
    expect(typeof obj.clone2).toBe('function');
    expect(() => obj.clone2()).toThrow('obj is not defined');

    obj.clone3 = cloneFunction(obj.fn3);
    expect(obj.clone3()).toBe(2);

    expect(obj.a).toBe(3);
    expect(obj.b).toBe(1);
    expect(obj.c).toBe(2);

    // -------- 以上复制除了箭头函数无法访问obj，其他都是正常的 ---------

    // 对外部变量对访问
    const o = { a: 1 };

    const fn = () => o.a;
    expect(() => cloneFunction(fn)()).toThrow('o is not defined');

    expect(() =>
      cloneFunction(function () {
        return o.a;
      })(),
    ).toThrow('o is not defined');

    // --------- 以上复制运行全部出错 ----------
  });
  test('deepClone', () => {
    const arr = [1, 2, 3];
    const newArr = deepClone(arr);
    // copy == arr
    expect(newArr).toEqual(arr);
    // copy !== arr
    expect(arr === newArr).toBe(false);

    const obj = { d: { f: 123 }, a: [2, 3], c: 1 };
    const newObj = deepClone(obj);
    // copy == obj
    expect(newObj).toEqual(obj);
    // copy !== obj
    expect(obj === newObj).toBe(false);
    // copy.a == obj.a
    expect(obj.a).toEqual(newObj.a);
    // copy.a !== obj.a
    expect(obj.a === newObj.a).toBe(false);

    // 0 === 0
    expect(deepClone(0)).toBe(0);

    const arr2 = [() => 100, () => 200];
    const newArr2 = deepClone(arr2);
    // copy == arr2
    expect(arr2 == newArr2).toBe(false);
    // copy !== arr2
    expect(newArr2 === arr2).toBe(false);
    // copy[0] == arr2[0]
    expect(newArr2[0] == arr2[0]).toBeTruthy();
    expect(newArr2[1] == arr2[1]).toBeTruthy();
    // copy[0] === arr2[0]
    expect(newArr2[0] === arr2[0]).toBeTruthy();
    expect(newArr2[1] === arr2[1]).toBeTruthy();
    // copy[0]() === arr2[0]()
    expect(newArr2[1]!() === arr2[1]!()).toBeTruthy();
    expect(newArr2[1]!()).toEqual(arr2[1]!());

    function Foo(this: any) {
      this['name'] = 'foo';
      this.sayHi = function () {
        console.log('Say Hi');
      };
    }

    Foo.prototype.sayGoodBy = function () {
      console.log('Say Good By');
    };

    // @ts-expect-error
    const myPro = new Foo();
    expect(hasOwn(myPro, 'name')).toBeTruthy(); //true
    expect(hasOwn(myPro, 'toString')).toBe(false); //false
    expect(hasOwn(myPro, 'hasOwnProperty')).toBe(false); //fasle
    expect(hasOwn(myPro, 'sayHi')).toBeTruthy(); // true
    expect(hasOwn(myPro, 'sayGoodBy')).toBe(false); //false
    expect('sayGoodBy' in myPro).toBeTruthy(); // true

    // test cov if (!(target as any).hasOwnProperty(k)) continue;
    const copyFoo = deepClone(myPro);
    expect(hasOwn(copyFoo, 'sayGoodBy')).toBe(false);

    // copy function
    function fn(arg: number) {
      return arg + fn.data;
    }

    fn.data = 100;

    const nFn = deepClone(fn);

    expect(fn(100)).toBe(200);
    expect(fn === nFn).toBeTruthy();
    expect(nFn(100)).toBe(200);
    expect(nFn.data).toBe(100);
    nFn.data = 200;
    expect(nFn.data).toBe(200);
    expect(fn.data).toBe(200);

    // copy date
    const date = new Date('2020-06-05 12:00:00');
    const o = deepClone({ date });
    expect(o.date.getFullYear()).toBe(date.getFullYear());
    expect(o.date === date).toBe(false);

    // copy regExp
    const re = new RegExp('\\d+', 'g');
    const o2 = deepClone({ re });
    expect(o2.re.test('123')).toBe(true);
    expect(o2.re === re).toBe(false);

    const o3: any = { e: { a: 1 }, a: 1, b: 2, c: 3 };
    o3.d = o3;
    const c = deepClone(o3);
    expect(c).toEqual(o3);
    expect(o3).toBe(c.d);
    expect(o3.e).toEqual(c.e);
    expect(o3.e).not.toBe(c.e);
  });

  test('deepCloneBfs', () => {
    const obj10086 = { a: 1, b: 2, c: 3, d: 4 };
    const nObj = deepCloneBfs(obj10086);
    expect(obj10086).toEqual(nObj);
    expect(nObj.c).toEqual(3);
    expect(nObj === obj10086).toBe(false);

    const obj10000 = { b: { c: '123' }, a: 1 };
    const nObj2 = deepCloneBfs(obj10000);
    expect(nObj2).toEqual(obj10000);

    const arr = [1, 2, 3];
    const newArr = deepCloneBfs(arr);
    // copy == arr
    expect(newArr).toEqual(arr);
    // copy !== arr
    expect(arr === newArr).toBe(false);

    const obj = { d: { f: 123 }, a: [2, 3], c: 1 };
    const newObj = deepCloneBfs(obj);
    // copy == obj
    expect(newObj).toEqual(obj);
    // copy !== obj
    expect(obj === newObj).toBe(false);
    // copy.a == obj.a
    expect(obj.a).toEqual(newObj.a);
    // copy.a !== obj.a
    expect(obj.a === newObj.a).toBe(false);

    // 0 === 0
    expect(deepCloneBfs(0)).toBe(0);

    function Ext(this: any) {
      this.a = 1;
    }

    Ext.prototype.b = '2';

    // @ts-expect-error
    expect(deepCloneBfs(new Ext())).toEqual({ a: 1 });

    const obj2 = { b: [1, 2], a: 1 };
    expect(deepCloneBfs(obj2)).toEqual({ b: [1, 2], a: 1 });
    expect(obj2 !== deepCloneBfs(obj2)).toBeTruthy();

    const obj3 = { b: undefined, a: null, c: NaN };
    expect(deepCloneBfs(obj3)).toEqual({ b: undefined, a: null, c: NaN });
  });
});
