export function myInstanceof(
  object: Record<string, unknown>,
  constructor: (...args: unknown[]) => unknown
) {
  let proto = object
  while (proto) {
    proto = Object.getPrototypeOf(proto)
    if (proto === constructor.prototype) return true
  }
  return false
}
