import { inRange } from './inRange';

/**
 * inRange的复数版
 *
 * @see inRange
 *
 * @example
 *
 * inRanges(0, [undefined as any, 100]); // true
 * inRanges(0, [0]); // true
 * inRanges(0, [1]); // false
 * inRanges(0, [1, 2]); // false
 *
 * inRanges(0, [1, 2], [-9, -1]); // false
 * inRanges(-9, [1, 2], [-9, -1]); // true
 * inRanges(-1, [1, 2], [-9, -1]); // true
 * inRanges(-10, [1, 2], [-9, -1]); // false
 * inRanges(-10, [1, 2], [-9, -1], [-20, -10]); // true
 * inRanges(0, [1, 2], [-9, -1]); // false
 */
export function inRanges(value: number, ...ranges: [number?, number?][]): boolean {
  return ranges.some((item) => inRange(value, item));
}
