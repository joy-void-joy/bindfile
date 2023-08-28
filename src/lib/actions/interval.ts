export type Options = {
  callback: () => void
  delayMs: number
}

export function interval(_: Element, { callback, delayMs }: Options) {
  let interval = setInterval(callback, delayMs)

  return {
    update({ callback, delayMs }: Options) {
      clearInterval(interval)
      interval = setInterval(callback, delayMs)
    },

    destroy() {
      clearInterval(interval)
    },
  }
}
