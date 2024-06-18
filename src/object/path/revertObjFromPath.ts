import { typeOf } from '../../data-type';

// 根据路径还原整个object
export function revertObjFromPath(pathArr: string[]): object {
  function getKV(path: string): {
    innerKey: string;
    value: string;
    key: string;
  } {
    const [k, value] = path.split('=').map((item) => decodeURIComponent(item)) as [string, string];
    let key = k;
    let innerKey = '';
    const reg = /\[([^[\]]*)]|\.\[?([^[\]]*)]?/g;
    if (reg.test(key)) {
      innerKey = RegExp.$1 || RegExp.$2;
      key = key.replace(reg, '');
    }
    // key = key.replace(/\[[^\[\]]*]/g, "");
    return {
      innerKey,
      value,
      key,
    };
  }
  return pathArr.reduce(
    (result, path) => {
      const { innerKey, value, key } = getKV(path);
      const resultValue = result[key];

      // no-fallthrough
      switch (typeOf(resultValue)) {
        case 'undefined':
          if (!innerKey) {
            result[key] = value;
          } else {
            const arr: any[] = [];
            arr[innerKey as any] = value;
            result[key] = arr;
          }
          break;
        case 'string':
          result[key] = [resultValue];

        case 'array':
          if (!innerKey) {
            result[key].push(value);
          } else {
            result[key][innerKey] = value;
          }
      }
      return result;
    },
    {} as Record<string, any>,
  );
}
