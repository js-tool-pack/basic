import { randomColor } from '../../src/random';
import * as color from '../../src/color/base';

describe('color', function () {
  test('isRGBColor', () => {
    const isRGBColor = color.isRGBColor;
    expect(isRGBColor('rgb(0,0,0)')).toBe(true);
    expect(isRGBColor('rgb(0, 0, 0)')).toBe(true);
    expect(isRGBColor('rgba(0,0,0,0)')).toBe(true);
    expect(isRGBColor('rgba(255,255,255,0)')).toBe(true);
    expect(isRGBColor('rgba(255, 255, 255, 0)')).toBe(true);
    expect(isRGBColor('rgba(100,100,255,0.123123)')).toBe(true);

    expect(isRGBColor('rgba(-1,0,0,1)')).toBe(false);
    expect(isRGBColor('rgba(0,-1,0,1)')).toBe(false);
    expect(isRGBColor('rgba(0,0,-1,1)')).toBe(false);
    expect(isRGBColor('rgba(0,0,0,-1)')).toBe(false);
    expect(isRGBColor('rgba(.,.,.,.)')).toBe(false);
    expect(isRGBColor('rga(0,0,0)')).toBe(false);
    expect(isRGBColor('rgba(266,0,0,0)')).toBe(false);
    expect(isRGBColor('rgba(0,266,0,0)')).toBe(false);
    expect(isRGBColor('rgba(0,0,266,0)')).toBe(false);
    expect(isRGBColor('rgba(0,0,266,2)')).toBe(false);
    expect(isRGBColor('rgba(1000,100,100)')).toBe(false);
    expect(isRGBColor('rgba(100,1000,100)')).toBe(false);
    expect(isRGBColor('rgba(100,100,1000)')).toBe(false);

    expect(isRGBColor('rgba(256,100,100)')).toBe(false);
    expect(isRGBColor('rgba(100,256,100)')).toBe(false);
    expect(isRGBColor('rgba(100,100,256)')).toBe(false);
    expect(isRGBColor('rgba(256,256,256)')).toBe(false);
    expect(isRGBColor('rgba(256, 256, 256)')).toBe(false);

    expect(isRGBColor('rgba(100,100,256,0)')).toBe(false);
    expect(isRGBColor('rgba((100,100,255,0)')).toBe(false);
    expect(isRGBColor('rgba0(100,100,255,0)')).toBe(false);
    expect(isRGBColor('rgba (100,100,255,0)')).toBe(false);
  });
  test('isHEXColor', () => {
    const isHEXColor = color.isHEXColor;
    // console.time("t")
    expect(isHEXColor('#ffffff')).toBe(true);
    expect(isHEXColor('#fff')).toBe(true);
    expect(isHEXColor('#ffff')).toBe(false);
    expect(isHEXColor('#fffff')).toBe(false);
    expect(isHEXColor('#FFFFFF')).toBe(true);
    expect(isHEXColor('#7d1919')).toBe(true);
    expect(isHEXColor('#7D1919')).toBe(true);
    expect(isHEXColor('#7d19199')).toBe(false);
    expect(isHEXColor('#7d191g')).toBe(false);
    expect(isHEXColor('rgba(0,0,266,2)')).toBe(false);
    const arr = randomColor(1000);
    expect(arr.every((i) => isHEXColor(i))).toBe(true);
    // console.timeEnd("t")
  });
  /*test("hexToRgb", () => {
    const fn = color.hexToRgb;
    expect(fn("#000000")).toBe("rgb(0,0,0)");
    expect(fn("#840707")).toBe("rgb(132,7,7)");
    expect(fn("#654D4D")).toBe("rgb(101,77,77)");
    expect(fn("#000")).toBe("rgb(0,0,0)");
    expect(fn("#00f")).toBe("rgb(0,0,255)");
    expect(() => fn("#hhhhhh")).toThrowError();
});*/
  test('rgbToHex', () => {
    const rgbToHex = color.rgbToHex;
    expect(rgbToHex('rgb(0,0,0)')).toBe('#000000');
    expect(rgbToHex('rgb(132,7,7)')).toBe('#840707');
    expect(rgbToHex('rgb(101,77,77)')).toBe('#654d4d');
    expect(() => rgbToHex('#hhhhhh')).toThrowError();
  });
  test('hslToRgb', () => {
    const hslToRgb = color.hslToRgb;
    expect(hslToRgb('hsl(220,13%,18%)')).toBe('rgb(40,44,52)');
    expect(hslToRgb('hsl(0,0%,14%)')).toBe('rgb(36,36,36)');
  });
});
