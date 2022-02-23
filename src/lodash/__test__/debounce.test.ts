import { describe, expect, it, vi } from 'vitest';
import { debounce } from '../debounce';

vi.useFakeTimers();

describe('Debounce utility', () => {
  it('should debounce a function', () => {
    let callCount = 0;

    const debounced = debounce((value: string) => {
      callCount++;
      return value;
    }, 32);

    let results = [debounced('a'), debounced('b'), debounced('c')];
    expect(results).toStrictEqual([undefined, undefined, undefined]);
    expect(callCount).toBe(0);

    vi.advanceTimersByTime(128);

    expect(callCount).toBe(1);
    results = [debounced('d'), debounced('e'), debounced('f')];
    expect(results).toStrictEqual(['c', 'c', 'c']);
    expect(callCount).toBe(1);

    vi.advanceTimersByTime(256);

    expect(callCount).toBe(2);
  });
});
