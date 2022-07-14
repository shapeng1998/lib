export function co(fn: () => Generator) {
  return new Promise((resolve, reject) => {
    const gen = fn()
    onfulfilled()

    function next(result: IteratorResult<unknown, unknown>) {
      const { value, done } = result
      if (done) return resolve(value)

      Promise.resolve(value).then(onfulfilled, onrejected)
    }

    function onfulfilled(value?: unknown) {
      try {
        const result = gen.next(value)
        next(result)
      } catch (e) {
        reject(e)
      }
    }

    function onrejected(reason?: unknown) {
      try {
        const result = gen.throw(reason)
        next(result)
      } catch (e) {
        reject(e)
      }
    }
  })
}
