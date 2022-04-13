import { describe, expect, it } from 'vitest'
import { getRandomArray } from '../../utils'
import { PriorityQueue } from '../priorityQueue'

describe('Heap algorithms', () => {
  const heap = new PriorityQueue<number>((a, b) => a - b)
  const nums = getRandomArray(10, -100, 100)

  it('Push', () => {
    nums.forEach(num => heap.push(num))
    expect(heap.size).toBe(nums.length)
  })

  it('Pop', () => {
    const sorted = [...nums].sort((a, b) => a - b)
    for (let i = 0; i < 10; i++)
      expect(heap.pop()).toBe(sorted[i])
  })

  it('Null front', () => {
    expect(heap.size).toBe(0)
    expect(heap.front()).toBe(null)
  })

  it('Max heap', () => {
    const sorted = [1, 2, 3, 4]
    const maxHeap = new PriorityQueue<number>((a, b) => b - a)
    sorted.forEach(x => maxHeap.push(x))
    expect(maxHeap.front()).toBe(sorted[sorted.length - 1])
  })
})
