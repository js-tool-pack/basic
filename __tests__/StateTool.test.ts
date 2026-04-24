import { expectError, expectType } from './object/common.test';
import { StateTool } from '../src';

describe('StateTool', () => {
  enum Color {
    RED,
    BLUE,
    GREEN,
  }
  it('is', () => {
    const state = new StateTool(Color.RED);
    expect(state.is(Color.RED)).toBe(true);
    expect(state.is(Color.GREEN)).toBe(false);
    // @ts-expect-error
    expectError(state.is('green'));
  });
  it('in', () => {
    const state = new StateTool(Color.BLUE);
    expect(state.in(Color.BLUE, Color.RED, Color.GREEN)).toBe(true);
    expect(state.in(Color.RED, Color.GREEN)).toBe(false);
    // @ts-expect-error
    expectError(state.in('green'));
  });
  it('set', () => {
    const state = new StateTool(Color.RED);
    expect(state.is(Color.RED)).toBe(true);
    expect(state.is(Color.GREEN)).toBe(false);
    state.value = Color.GREEN;
    expect(state.is(Color.GREEN)).toBe(true);
    // @ts-expect-error
    expectError((state.value = 5));
  });
  it('is, no default', () => {
    const state = new StateTool<Color | null>(null);
    expect(state.in(Color.BLUE, Color.RED, Color.GREEN)).toBe(false);
    expect(state.value === null).toBe(true);
    // @ts-expect-error
    expectError(state.is('green'));
  });
  it('value type', () => {
    const state = new StateTool<Color | void>(void 0);
    state.value = Color.RED;
    state.value = undefined;
    expectType<Color | void>(state.value);

    const state2 = new StateTool(Color.RED);
    state2.value = Color.GREEN;
    // @ts-expect-error
    state2.value = undefined;
    expectType<Color>(state2.value);
  });
});
