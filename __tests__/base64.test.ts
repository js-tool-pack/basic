import {
  parseBase64,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  stringToArrayBuffer,
  arrayBufferToString,
} from '../src';

describe('Base64', () => {
  test('parseBase64', () => {
    // { hello: 'world' }
    const p = parseBase64('data:application/json;base64,ewogICJoZWxsbyI6ICJ3b3JsZCIKfQ==');
    expect(p.mime).toBe('application/json');
    expect(String.fromCodePoint(...p.uint8Array)).toBe('{\n  "hello": "world"\n}');

    const p2 = parseBase64('ewogICJoZWxsbyI6ICJ3b3JsZCIKfQ==');
    expect(p2.mime).toBe('');
    expect(String.fromCodePoint(...p2.uint8Array)).toBe('{\n  "hello": "world"\n}');
    expect(arrayBufferToString(p2.uint8Array, 8)).toBe('{\n  "hello": "world"\n}');
  });

  test('arrayBufferToBase64', () => {
    const str = JSON.stringify({ hello: 'world' }, null, 2);
    const buffer = stringToArrayBuffer(str, 8);
    expect(arrayBufferToBase64(buffer)).toBe('ewogICJoZWxsbyI6ICJ3b3JsZCIKfQ==');
  });

  test('base64ToArrayBuffer', () => {
    const base64 = 'data:application/json;base64,ewogICJoZWxsbyI6ICJ3b3JsZCIKfQ==';
    const buffer = base64ToArrayBuffer(base64);
    expect(arrayBufferToBase64(buffer)).toBe(base64.split(',')[1]);
  });
});
