import { toNonExponential } from '../number';

export type BYTE_UNIT = 'YB' | 'ZB' | 'EB' | 'PB' | 'TB' | 'GB' | 'MB' | 'KB' | 'B';

/**
 * 格式化字节数
 *
 * @example
 *
 * formatBytes(0); // '0B'
 * formatBytes(1); // '1B'
 * formatBytes(-1); // '-1B'
 *
 * formatBytes(1024); // '1KB'
 * formatBytes(1024 * 1024); // '1MB'
 * formatBytes(1024 * 1024 * 1024); // '1GB'
 * formatBytes(1024 * 1024 * 1024 * 1024); // '1TB'
 * formatBytes(1024 * 1024 * 1024 * 1024 * 1024); // '1PB'
 * formatBytes(1024 ** 6); // '1EB'
 * formatBytes(1024 ** 7); // '1ZB'
 * formatBytes(1024 ** 8); // '1YB'
 *
 * formatBytes(1024 * 512 + 1000); // '512.98KB'
 *
 * // 指定单位
 * formatBytes(1024 * 512, { unit: 'MB' }); // '0.5MB'
 * formatBytes(1024 * 512, { unit: 'GB' }); // '0GB'
 * // 指定小数位
 * formatBytes(1024 * 512, { unit: 'GB', fractionDigits: 5 }); // '0.00049GB'
 * formatBytes(1, { unit: 'GB', fractionDigits: 9 }); // '0.000000001GB'
 * // 使用科学计数法
 * formatBytes(1, { unit: 'GB', fractionDigits: 9, exponential: true }); // '1e-9GB'
 *
 * @param bytes 字节数
 * @param {{}} options
 * @param options.unit 指定单位
 * @param [options.fractionDigits=2] 指定小数位；默认2
 * @param [options.exponential=false] 是否使用科学计数法；默认false
 */
export function formatBytes(
  bytes: number,
  {
    unit,
    fractionDigits = 2,
    exponential = false,
  }: { unit?: BYTE_UNIT; fractionDigits?: number; exponential?: boolean } = {},
): string {
  // 名称     -符号 -	二进制计量 -	十进制计量 -	字节数                               -	等于
  // KiloByte	  KB	  210       	103       	1,024	                             1,024 B
  // MegaByte	  MB	  220       	106       	1,048,576	                         1,024 KB
  // GigaByte	  GB	  230       	109       	1,073,741,824	                     1,024 MB
  // TeraByte	  TB	  240       	1012       	1,099,511,627,776	                 1,024 GB
  // PetaByte	  PB	  250       	1015       	1,125,899,906,842,624	             1,024 TB
  // ExaByte	  EB	  260       	1018       	1,152,921,504,606,846,976	         1,024 PB
  // ZettaByte	ZB	  270       	1021       	1,180,591,620,717,411,303,424	     1,024 EB
  // YottaByte	YB	  280       	1024       	1,208,925,819,614,629,174,706,176	 1,024 ZB

  const kb = 1024;
  const mb = kb ** 2;
  const gb = kb ** 3;
  const tb = kb ** 4;
  const pb = kb ** 5;
  const eb = kb ** 6;
  const zb = kb ** 7;
  const yb = kb ** 8;
  const match: [number, BYTE_UNIT][] = [
    [yb, 'YB'],
    [zb, 'ZB'],
    [eb, 'EB'],
    [pb, 'PB'],
    [tb, 'TB'],
    [gb, 'GB'],
    [mb, 'MB'],
    [kb, 'KB'],
    [0, 'B'],
  ];

  const handler: (item: [number, BYTE_UNIT]) => boolean = unit
    ? ([, u]) => u === unit
    : (
        (absByte: number) =>
        ([range]) =>
          absByte >= range
      )(Math.abs(bytes));

  const [range, _unit] = match.find(handler)!;
  const result = Number((bytes / (range || 1)).toFixed(fractionDigits));
  return (exponential ? result : toNonExponential(result)) + _unit;
}
