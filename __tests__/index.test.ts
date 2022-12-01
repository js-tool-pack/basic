import * as testTarget from '../src';

describe('basic', function () {
  test('base', () => {
    expect(testTarget.test()).toBe('test');
  });
});
