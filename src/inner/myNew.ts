export function myNew(cf: Function, ...args: any) {
  const obj = Object.create(cf.prototype)
  cf.call(obj, ...args)
  return obj
}
