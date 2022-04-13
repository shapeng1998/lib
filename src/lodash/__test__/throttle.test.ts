import { describe, expect, it, vi } from 'vitest'
import { throttle } from '../throttle'

vi.useFakeTimers()

describe('Throttle utility', () => {
  it('should throttle a function', () => {
    let callCount = 0

    const throttled = throttle(() => {
      callCount++
    }, 32)

    throttled()
    throttled()
    throttled()

    expect(callCount).toBe(1)

    callCount = 0

    vi.advanceTimersByTime(37)
    throttled()
    vi.advanceTimersByTime(37)
    throttled()
    vi.advanceTimersByTime(37)
    throttled()

    expect(callCount).toBe(3)
  })
})
