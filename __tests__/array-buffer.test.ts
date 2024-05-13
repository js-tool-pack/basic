import * as AB from '../src/array-buffer';
describe('ArrayBuffer', function () {
  test('arrayBufferToString', () => {
    const ab = new Uint8Array(2);
    ab[0] = 1;
    ab[1] = 2;
    expect(AB.arrayBufferToString(ab)).toBe('');
    expect(AB.arrayBufferToString(new Uint8Array(0))).toBe('');
  });
  test('stringToArrayBuffer & arrayBufferToString', () => {
    const v = AB.stringToArrayBuffer('123');
    expect(AB.arrayBufferToString(v)).toBe('123');
  });
  test('encodeObjectToArrayBuffer & decodeArrayBufferToObject', () => {
    const v = AB.encodeObjectToArrayBuffer({ a: 1, b: 2 });
    expect(AB.decodeArrayBufferToObject(v)).toEqual({ a: 1, b: 2 });
  });
});
