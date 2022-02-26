import { describe, expect, it } from 'vitest';
import { myInstanceof } from '../myInstanceof';

class Cat {}

describe('Instanceof inner function', () => {
  it('should check instanceof', () => {
    const cat = new Cat();
    expect(myInstanceof(cat, Cat)).toBe(true);
    expect(myInstanceof(cat, Object)).toBe(true);
    expect(myInstanceof(cat, Function)).toBe(false);
  });
});
