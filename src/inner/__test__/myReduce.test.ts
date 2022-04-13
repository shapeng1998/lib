import { describe, expect, it } from 'vitest'
import { myReduce } from '../myReduce'

describe('Array.prototype.reduce inner function', () => {
  it('reduce function should work', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = myReduce(arr, (acc, cur) => acc + cur, 0)
    expect(result).toBe(15)

    const result2 = myReduce(arr, (acc, cur) => acc + cur, 1)
    expect(result2).toBe(16)
  })
})
