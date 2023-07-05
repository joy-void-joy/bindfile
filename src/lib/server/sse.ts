import { EventEmitter } from 'node:events'

export type ID = string

interface RefreshEventSourceEventMap extends EventSourceEventMap {
  initialize: MessageEvent<{ id: ID }>
  refresh: MessageEvent<{ sender: ID }>
}

declare interface RefreshEmmiter {
  refresh(): void
  on(event: 'refresh', listener: (id: ID) => void): this
}

class RefreshEmmiter extends EventEmitter {
  refresh() {
    this.emit('refresh')
  }
}

const listeners = new Map<string, RefreshEmmiter>()

export function addListener() {
  const id = crypto.randomUUID()
  const listener = new RefreshEmmiter()
  listeners.set(id, listener)

  return { id, listener }
}

export function removeListener(id: ID) {
  listeners.delete(id)
}

export function broadcast(sender: ID) {
  for (const [id, listener] of listeners) {
    if (id == sender) continue

    listener.refresh()
  }
}
