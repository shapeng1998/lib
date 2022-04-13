export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomArray(length: number, min: number, max: number) {
  return Array.from({ length }, () => getRandomNumber(min, max))
}

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
