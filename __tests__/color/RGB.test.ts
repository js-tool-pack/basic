import { isRGBColor, isHEXColor } from '../../src/color/base';
import { createArray, unique } from '../../src/array';
import { RGB } from '../../src/color/RGB';

describe('RGB', function () {
  const rgb = new RGB();
  const rgb2 = new RGB(255, 0, 1);
  const rgbList = createArray({ fill: RGB.random, len: 200 });
  test('RGB.toString', () => {
    expect(rgb.toString()).toBe('rgb(0,0,0)');
    expect(rgb2.toString()).toBe('rgb(255,0,1)');
    expect(new RGB(1000, -1000, 200).toString()).toBe('rgb(255,0,200)');
  });
  test('RGB.random', () => {
    expect(rgbList.every((r) => isRGBColor(r.toString()))).toBeTruthy();
    expect(unique(rgbList.map((i) => i.toString())).length > 180).toBeTruthy();
    expect(rgbList.every((r) => isHEXColor(r.toHEX()))).toBeTruthy();
  });
  test('RGB.toHEX', () => {
    expect(rgb.toHEX()).toBe('#000000');
    expect(rgb2.toHEX()).toBe('#ff0001');
    expect(rgb2.toHEX()).toBe('#ff0001');
  });
  test('RGB.fromStr', () => {
    expect(RGB.fromStr('rgb(0,0,0)').toHEX()).toBe('#000000');
    expect(RGB.fromStr('rgb(170,23,23)').toHEX()).toBe('#aa1717');
    expect(RGB.fromStr('rgb(255,255,255)').toHEX()).toBe('#ffffff');
    expect(RGB.fromStr('rgba(255,255,255,0.1)').toHEX()).toBe('#ffffff');
    expect(() => {
      RGB.fromStr('rgb(255,255,1000)');
    }).toThrowError();
  });
  test('RGB.fromHEX', () => {
    expect(RGB.fromHEX('#000000').toString()).toBe('rgb(0,0,0)');
    expect(RGB.fromHEX('#aa1717').toString()).toBe('rgb(170,23,23)');
    expect(RGB.fromHEX('#ffffff').toString()).toBe('rgb(255,255,255)');
    expect(RGB.fromHEX('#ffffff').toString()).toBe('rgb(255,255,255)');

    expect(RGB.fromHEX('#000').toString()).toBe('rgb(0,0,0)');
    expect(RGB.fromHEX('#00f').toString()).toBe('rgb(0,0,255)');
    expect(() => RGB.fromHEX('#hhhhhh').toString()).toThrowError();
  });
  test('RGB.toRGBA', () => {
    expect(rgb.toRGBA().toString()).toBe('rgba(0,0,0,1)');
  });
});
