import { describe, expect, it } from 'vitest';
import { getRandomArray } from '../../utils';
import { PriorityQueue } from '../priorityQueue';

describe('Heap algorithms', () => {
  const heap = new PriorityQueue<number>((a, b) => a - b);
  const nums = getRandomArray(10, -100, 100);

  it('Push', () => {
    nums.forEach((num) => heap.push(num));
    expect(heap.size).toBe(nums.length);
  });

  it('Pop', () => {
    const sorted = [...nums].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
      expect(heap.pop()).toBe(sorted[i]);
    }
  });
});
