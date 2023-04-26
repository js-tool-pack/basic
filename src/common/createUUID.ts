/**
 * 生成uuid
 *
 * @example
 *
 * createUUID(); // 3976e106-3841-ee99-c65aa773c9d1b977 随机值
 *
 * @param [template='xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxx'] uuid模板:默认模板（8-4-4-16）
 */
export function createUUID(template = 'xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxx'): string {
  return template.replace(/x/g, () => (~~(Math.random() * 0x10)).toString(16));
}
