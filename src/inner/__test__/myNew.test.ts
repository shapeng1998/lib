import { describe, expect, it } from 'vitest'
import { myNew } from '../myNew'

describe('new inner function', () => {
  it('new instance should work', () => {
    const Person = function(this: any, name: string) {
      this.name = name
      this.age = 10
    } as any

    Person.prototype.greeting = function() {
      return `${this.name} ${this.age}`
    }

    const p1 = new Person('test')
    const p2 = myNew(Person, 'test')

    expect(p1).toEqual(p2)
    expect(Object.getPrototypeOf(p1)).toEqual(Person.prototype)
    expect(Object.getPrototypeOf(p1)).toEqual(Object.getPrototypeOf(p2))
  })
})
