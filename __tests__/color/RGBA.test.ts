import { isRGBColor, isHEXColor } from '../../src/color/base';
import { createArray, unique } from '../../src/array';
import { RGBA } from '../../src/color/RGBA';

describe('RGBA', function () {
  const rgb = new RGBA();
  const rgb2 = new RGBA(255, 0, 1);
  const rgbList = createArray({ fill: RGBA.random, len: 200 });
  test('RGBA.toString', () => {
    expect(rgb.toString()).toBe('rgba(0,0,0,1)');
    expect(rgb2.toString()).toBe('rgba(255,0,1,1)');
    expect(new RGBA(1000, -1000, 200).toString()).toBe('rgba(255,0,200,1)');
  });
  test('RGBA.random', () => {
    expect(rgbList.every((r) => isRGBColor(r.toString()))).toBeTruthy();
    expect(unique(rgbList.map((i) => i.toString())).length > 180).toBeTruthy();
    expect(rgbList.every((r) => isHEXColor(r.toHEX()))).toBeTruthy();
  });
  test('RGBA.toHEX', () => {
    expect(rgb.toHEX()).toBe('#000000');
    expect(rgb2.toHEX()).toBe('#ff0001');
    expect(rgb2.toHEX()).toBe('#ff0001');
  });
  test('RGBA.fromStr', () => {
    expect(RGBA.fromStr('rgba(0,0,0,1)').toHEX()).toBe('#000000');
    expect(RGBA.fromStr('rgba(170,23,23,1)').toHEX()).toBe('#aa1717');
    expect(RGBA.fromStr('rgba(255,255,255,0.2)').toHEX()).toBe('#ffffff');
    expect(RGBA.fromStr('rgba(255,255,255,0.4)').toHEX()).toBe('#ffffff');
    expect(RGBA.fromStr('rgba(255,255,255,0.1)').toHEX()).toBe('#ffffff');
    expect(() => {
      RGBA.fromStr('rgb(255,255,1000)');
    }).toThrowError();
  });
  test('RGBA.toRGB', () => {
    expect(rgb.toRGB().toString()).toBe('rgb(0,0,0)');
  });
});
