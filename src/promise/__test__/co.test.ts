import { describe, expect, it } from 'vitest'
import fetch from 'node-fetch'
import { co } from '../co'

const url = 'https://jsonplaceholder.typicode.com/todos/1'

const resolveSetTimeout = (value: any, ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value)
    }, ms)
  })
}

function* helloGenerator(): Generator<number, number, number> {
  const a = yield 1
  const b = yield a + 1
  const c = yield b + 1
  const d = yield c + 1
  return d
}

function* fetchUser(): Generator<Object> {
  const user = yield fetch(url).then((res) => res.json())
  return user
}

describe('co test suite', () => {
  it('co function should automaticly execute the generator function', async () => {
    expect(
      await co(function* () {
        return 'hello'
      })
    ).toEqual('hello')

    expect(
      await co(function* () {
        const value1 = yield resolveSetTimeout('hello', 500)
        const value2 = yield resolveSetTimeout('world', 500)
        const value3 = yield* fetchUser()
        const value4 = yield* helloGenerator()
        return [value1, value2, value3, value4]
      })
    ).toEqual([
      'hello',
      'world',
      { completed: false, id: 1, title: 'delectus aut autem', userId: 1 },
      4,
    ])
  })
})
