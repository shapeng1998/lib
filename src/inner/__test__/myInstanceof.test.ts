import { describe, expect, it } from 'vitest';
import { myInstanceof } from '../myInstanceof';

describe('Instanceof inner function', () => {
  it('should check instanceof', () => {
    const arr = new Array();
    expect(myInstanceof(arr, Array)).toBe(arr instanceof Array);
    expect(myInstanceof(arr, Object)).toBe(arr instanceof Object);
    expect(myInstanceof(arr, Function)).toBe(arr instanceof Function);
  });
});
