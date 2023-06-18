/**
 * 查找是否items中任何一个在list中
 *
 * @example
 *
 * someInList([0, 20, 100], [...Array(10).keys()]); // true
 *
 * someInList([500, 20], Array.from({ length: 10 })); // false
 *
 * someInList([{ id: 1 }], [{ id: 1 }, { id: 2 }, { id2: 3 }]); // false
 *
 * const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
 * someInList([{ id: 1 }], list, (item, _i, list) => list.some((s) => s.id === item.id)),; // true
 *
 */
export function someInList<T>(
  items: T[],
  list: T[],
  cb: (item: T, index: number, list: T[]) => boolean = (v, _, arr) => arr.includes(v),
): boolean {
  return items.some((item, index) => {
    return cb(item, index, list);
  });
}
