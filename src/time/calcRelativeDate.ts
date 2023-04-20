/**
 * 比如根据服务器与本地时间的差值计算实际日期
 *
 * @example
 *
 * const now = new Date();
 * const d = calcRelativeDate(now);
 *
 * d().getTime() === now.getTime(); // true
 *
 * await sleep(100);
 * now.getTime() + 90 <= d().getTime() && d().getTime() <= now.getTime() + 110; // true
 *
 * await sleep(100);
 * now.getTime() + 190 <= d().getTime() && d().getTime() <= now.getTime() + 210; // true
 *
 * @param init 服务器日期
 * @return {() => Date} 返回一个闭包，闭包返回实际日期，每次调用都返回实际日期
 */
export function calcRelativeDate(init: Date) {
  const diff = init.getTime() - Date.now();
  return () => new Date(Date.now() + diff);
}
