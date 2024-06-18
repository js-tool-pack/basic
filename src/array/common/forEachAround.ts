import { inRange } from './inRange';

// eslint-disable-next-line no-restricted-syntax
const enum Direct {
  bottom = 'bottom',
  right = 'right',
  left = 'left',
  top = 'top',
}

/**
 * 环绕式遍历数组
 *
 * @example
 *
 * ```ts
 * const arr = [
 *   [1, 2, 3, 4, 5],
 *   [6, 7, 8, 9, 10],
 *   [11, 12, 13, 14, 15],
 *   [16, 17, 18, 19, 20],
 *   [21, 22, 23, 24, 25],
 * ];
 *
 * const res: number[] = [];
 *
 * // 顺时针遍历
 * forEachAround(arr, (v) => res.push(v));
 * console.log(res); // [1, 2, 3, 4, 5, 10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6, 7, 8, 9, 14, 19, 18, 17, 12, 13]
 *
 * res.length = 0;
 * // 逆时针遍历
 * forEachAround(arr, (v) => res.push(v), {reverse: true});
 * console.log(res); // [1, 6, 11, 16, 21, 22, 23, 24, 25, 20, 15, 10, 5, 4, 3, 2, 7, 12, 17, 18, 19, 14, 9, 8, 13]
 *
 * res.length = 0;
 * // 只遍历最外面一圈
 * forEachAround(arr, (v, i): false | void => {
 *   if (i[0] === 1 && i[1] === 1) return false;
 *   res.push(v);
 * });
 * console.log(res); // [1, 2, 3, 4, 5, 10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6]
 *
 * res.length = 0;
 * // 只遍历最外面一圈,并且跳过第一层
 * forEachAround(arr, (v, i): false | void => {
 *   if (i[0] === 0 && i[1] === 0) {
 *     // 移动到第二行倒数第二列
 *     i[0] = 1;
 *     i[1] = 3;
 *     return;
 *   }
 *   if (i[0] === 1 && i[1] === 1) return false;
 *   res.push(v);
 * });
 * console.log(res); // [10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6]
 *
 * res.length = 0;
 * // 只遍历最外面一圈,并且跳过第一层（使用startIndexes和startDirect）
 * forEachAround(
 *   arr,
 *   (v, i): false | void => {
 *     res.push(v);
 *     if (i[0] === 0 && i[1] === 0) return false;
 *   },
 *   { startIndexes: [1, 4], startDirect: 'bottom' },
 * );
 * console.log(res); // [10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6, 1]
 *
 * ```
 *
 * @param arr 需要遍历的数组
 * @param callbackFn 回调函数
 * @param {{}} options
 * @param options.reverse 是否逆时针遍历；默认为false，顺时针遍历
 * @param options.startIndexes 开始时的index，默认[0, 0]
 * @param options.startDirect 开始时的方向，默认向右('right')，reverse为true时向左('left')
 */
export function forEachAround<T extends Array<any[]>>(
  arr: T,
  callbackFn: (
    value: T extends Array<(infer R)[]> ? R : unknown,
    indexes: [col: number, row: number],
    array: T,
  ) => false | any,
  {
    reverse = false,
    startIndexes,
    startDirect,
  }: {
    startIndexes?: [col: number, row: number];
    startDirect?: keyof typeof Direct;
    reverse?: boolean;
  } = {},
) {
  let direct = (startDirect as Direct) ?? (reverse ? Direct.bottom : Direct.right);
  let indexes: [col: number, row: number] = startIndexes ?? [0, 0];
  const ranges: [col: [start: number, end: number], row: [start: number, end: number]] = [
    [0, arr.length - 1],
    [0, (arr[0]?.length || 0) - 1],
  ];
  function getNextIndexes(direct: Direct): typeof indexes | null {
    let x = 0;
    let y = 0;
    const matches: Record<Direct, () => void> = {
      [Direct.bottom]: () => y++,
      [Direct.right]: () => x++,
      [Direct.left]: () => x--,
      [Direct.top]: () => y--,
    };
    matches[direct]();
    const _indexes: typeof indexes = [indexes[0] + y, indexes[1] + x];
    const [colRange, rowRange] = ranges;
    if (!inRange(_indexes[0], colRange) || !inRange(_indexes[1], rowRange)) return null;
    return _indexes;
  }
  function getNewDirect(): Direct | null {
    const matches: Record<Direct, () => Direct> = {
      [Direct.bottom]: () => (reverse ? Direct.right : Direct.left),
      [Direct.right]: () => (reverse ? Direct.top : Direct.bottom),
      [Direct.left]: () => (reverse ? Direct.bottom : Direct.top),
      [Direct.top]: () => (reverse ? Direct.left : Direct.right),
    };
    const _d = matches[direct]();
    return getNextIndexes(_d) && _d;
  }
  function updateRanges(): void {
    const [colRange, rowRange] = ranges;
    const matches: Record<Direct, () => void> = {
      [Direct.bottom]: () => (reverse ? rowRange[0]++ : rowRange[1]--),
      [Direct.right]: () => (reverse ? colRange[1]-- : colRange[0]++),
      [Direct.left]: () => (reverse ? colRange[0]++ : colRange[1]--),
      [Direct.top]: () => (reverse ? rowRange[1]-- : rowRange[0]++),
    };
    matches[direct]();
  }
  let whileFlag = true;
  const runCB = () => {
    const [col, row] = indexes;
    const item = arr[col]?.[row];
    if (callbackFn(item, indexes, arr) === false) whileFlag = false;
  };
  if (inRange(indexes[0], ranges[0]) && inRange(indexes[1], ranges[1])) runCB();
  while (whileFlag) {
    const nextIndexes = getNextIndexes(direct);
    if (nextIndexes) {
      indexes = nextIndexes;
      runCB();
      continue;
    }
    const _d = getNewDirect();
    if (_d === null) break;
    updateRanges();
    direct = _d;
  }
}
