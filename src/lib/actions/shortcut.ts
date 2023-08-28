type ShortcutProps = {
  alt?: boolean
  shift?: boolean
  control?: boolean
  code?: string
  callback?: (() => void) | (() => Promise<void>)
}

export const shortcut = (node: HTMLElement, params: ShortcutProps = {}) => {
  let handler: (this: unknown, ev: KeyboardEvent) => void
  const callHandler = (e: KeyboardEvent) => handler(e)

  const update = (options: ShortcutProps) => {
    handler = (e) => {
      const { alt = false, shift = false, control = false, code = '', callback } = options

      if (
        alt != e.altKey ||
        shift != e.shiftKey ||
        control != (e.ctrlKey || e.metaKey) ||
        e.code != code
      ) {
        return
      }
      e.preventDefault()

      callback ? callback() : node.click()
    }
  }

  window.addEventListener('keydown', callHandler)
  update(params)

  return {
    update,
    destroy() {
      window.removeEventListener('keydown', callHandler)
    },
  }
}
