/**
 * 组合成new Function需要的参数
 *
 * 实现apply的时候可以使用此方法
 *
 * @see functionApply
 *
 */
export function generateFunctionCode(argsArrayLength: number): string {
  let code = 'return arguments[0][arguments[1]](';
  // 拼接args
  for (let i = 0; i < argsArrayLength; i++) {
    if (i > 0) {
      code += ',';
    }
    code += 'arguments[2][' + i + ']';
  }
  code += ')';
  // return object.property(args)
  // return arguments[0][arguments[1]](arg1, arg2, arg3...)
  return code;
}
