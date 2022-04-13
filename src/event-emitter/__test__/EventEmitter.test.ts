import { describe, expect, it, vi } from 'vitest'
import { EventEmitter } from '../EventEmitter'

describe('EventEmitter', () => {
  describe('on', () => {
    it('should be called when event is emitted', () => {
      const event = new EventEmitter()
      const fn = vi.fn()

      event.on('test', fn)

      event.emit('test')

      expect(fn).toHaveBeenCalled()
    })
  })

  describe('once', () => {
    it('should be called only once', () => {
      const event = new EventEmitter()
      const fn = vi.fn()

      event.once('test', fn)

      event.emit('test')
      event.emit('test')

      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('off', () => {
    it('should not be called when event is emitted', () => {
      const event = new EventEmitter()
      const fn = vi.fn()

      event.on('test', fn)
      event.off('test', fn)

      event.emit('test')

      expect(fn).not.toHaveBeenCalled()
    })
  })
})
