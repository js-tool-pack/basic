/**
 * 格式化毫秒值
 *
 * @example
 *
 * formatMilliseconds(1000, 'd天hh时'); // '0天00时'
 * formatMilliseconds(1000); // '0天00时00分01秒'
 * formatMilliseconds(60 * 1000); // '0天00时01分00秒'
 * formatMilliseconds(60 * 60 * 1000); // '0天01时00分00秒'
 * formatMilliseconds(60 * 60 * 24 * 1000); // '1天00时00分00秒'
 *
 * @param ms 毫秒值
 * @param [format=d天hh时mm分ss秒] - 格式化模板，默认'd天hh时mm分ss秒'
 */
export function formatMilliseconds(ms: number, format = 'd天hh时mm分ss秒') {
  let result = format;
  const seconds = ~~(ms / 1000);
  const obj: {
    [k: string]: number;
  } = {
    's+': seconds % 60,
    'm+': ~~(seconds / 60) % 60,
    'h+': ~~(seconds / (60 * 60)) % 24,
    // 'd+': ~~(seconds / (60 * 60 * 24))
  };
  // 有多少天就显示多少天,但不会补0
  const days = ~~(seconds / (60 * 60 * 24));
  result = result.replace(/d+/, String(days));
  for (const k in obj) {
    const reg = new RegExp('(' + k + ')');
    if (reg.test(result)) {
      const s1 = RegExp.$1;
      const v = obj[k];
      let value = String(v).padStart(s1.length, '0');
      value = value.substring(value.length - s1.length);
      result = result.replace(s1, value);
    }
  }
  return result;
}
