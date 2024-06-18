import type { TupleM2N } from '@tool-pack/types';

/**
 * 解析base64的mime和uint8Array
 *
 *
 * @example
 *
 * // { hello: 'world' }
 * const p = parseBase64('data:application/json;base64,ewogICJoZWxsbyI6ICJ3b3JsZCIKfQ==');
 * p.mime; // 'application/json'
 * String.fromCodePoint(...p.uint8Array); // '{\n  "hello": "world"\n}'
 */
export function parseBase64(base64: string): {
  uint8Array: Uint8Array;
  mime: string;
} {
  const [mime, body] = splitBase64(base64);
  let len = body.length;
  const uint8Array = new Uint8Array(len);
  while (len--) uint8Array[len] = body.charCodeAt(len);
  return { uint8Array, mime };
}
function splitBase64(base64: string): [mime: string, body: string] {
  const split = base64.split(',') as TupleM2N<string, 1, 2>;
  let mime = '';
  let body = '';

  if (split.length === 1) {
    body = split[0];
  } else {
    mime = (split[0].match(/:(.*?);/) ?? [])[1] as string;
    body = split[1];
  }

  return [mime, atob(body)];
}
