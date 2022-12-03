import * as cm from '../../src/object/tree';

describe('tree', function () {
  test('getTreeMaxDeep', () => {
    expect(cm.getTreeMaxDeep({})).toBe(1);
    expect(cm.getTreeMaxDeep({ a: 1 })).toBe(2);
    expect(cm.getTreeMaxDeep(null as any)).toBe(0);
    expect(cm.getTreeMaxDeep({ a: { b: 1 } })).toBe(3);
    const obj: any = { a: { a2: 1 }, b: 1, c: { c2: { c3: 123, c32: {} } } };
    expect(cm.getTreeMaxDeep(obj)).toBe(4);
    expect(cm.getTreeMaxDeep([])).toBe(1);
    expect(cm.getTreeMaxDeep([1, 2, 4, 5])).toBe(2);
    expect(cm.getTreeMaxDeep([1, 2, 4, 5, { a: 3 }])).toBe(3);

    function Fn(this: any) {
      this.test = { a: 1, b: 2 };
    }

    Fn.prototype.c = { a: { b: 2, c: { d: 123 } } };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fn = new Fn();
    expect(cm.getTreeMaxDeep(fn)).toBe(3);
  });
  test('getTreeNodeLen', () => {
    expect(cm.getTreeNodeLen({}, -1)).toBe(0);
    expect(cm.getTreeNodeLen({}, 0)).toBe(1);
    expect(cm.getTreeNodeLen({})).toBe(0);
    expect(cm.getTreeNodeLen({ a: 1, b: 2, c: 3 })).toBe(3);
    expect(cm.getTreeNodeLen({ a: 1, b: 2, c: 3, d: { d1: 123, d2: 1, d3: 123 } })).toBe(4);
    expect(
      cm.getTreeNodeLen({ a: 1, b: { b2: 2, b3: 3 }, c: 3, d: { d1: 123, d2: 1, d3: 123 } }),
    ).toBe(4);
    expect(
      cm.getTreeNodeLen({ a: 1, b: { b2: 2, b3: 3 }, c: 3, d: { d1: 123, d2: 1, d3: 123 } }, 2),
    ).toBe(5);
    expect(cm.getTreeNodeLen({ a: { a2: 1 }, b: { b2: 2 }, c: { c2: 3 }, d: { d1: 4 } }, 2)).toBe(
      4,
    );
    expect(
      cm.getTreeNodeLen(
        { a: { a2: 1, a3: { a4: 4 } }, b: { b2: 2 }, c: { c2: 3 }, d: { d1: 4 } },
        3,
      ),
    ).toBe(1);
    expect(
      cm.getTreeNodeLen(
        {
          a: { a2: 1, a3: { a4: 4 } },
          b: { b2: 2, b3: { b4: 4 } },
          c: { c2: 3 },
          d: { d1: 4 },
        },
        3,
      ),
    ).toBe(2);
    expect(cm.getTreeNodeLen([0, 1, [3, 4, 5]], 2)).toBe(3);
    expect(cm.getTreeNodeLen([0, 1, { a: 12, b: 1, c: 4 }], 2)).toBe(3);

    function Fn(this: any) {
      this.test = { a: 1, b: 2 };
    }

    Fn.prototype.c = { a: { b: 2, c: { d: 123 } } };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fn = new Fn();
    expect(cm.getTreeNodeLen(fn, 2)).toBe(2);
  });
});
