export function myInstanceof(object: Object, constructor: Function) {
  let proto = object
  while (proto) {
    proto = Object.getPrototypeOf(proto)
    if (proto === constructor.prototype)
      return true
  }
  return false
}
