interface Listener {
  name: string
  once: boolean
  execute: (event: any) => void
}

class Emitter {
  private listeners: Listener[]

  constructor() {
    this.listeners = []
  }

  on(name: string | string[], execute: (event: any) => void, once = false) {
    const names = typeof name == 'string' ? [name] : name

    for (const name of names) {
      this.listeners.push({
        name,
        once,
        execute,
      })
    }
  }

  off(element: ((event: any) => void) | string) {
    this.listeners = this.listeners.filter((listener) => {
      return listener.name != element && listener.execute != element
    })
  }

  emit(name: string, event?: any) {
    for (const listener of this.listeners) {
      if (listener.name == name) {
        listener.execute(event)
      }

      if (listener.once) {
        this.off(listener.execute)
      }
    }
  }
}

import { onBeforeUnmount, onBeforeMount } from 'vue'

/**
 * Only inside vue component using
 */
function onEmit(name: string | string[], execute: (event: any) => void, emitter: Emitter, debounce=0) {
  if (debounce > 0) {
    
  }
  
  const names = typeof name == 'string' ? [name] : name

  onBeforeMount(() => {
    for (const name of names) {
      emitter.on(name, execute)
    }
  })

  onBeforeUnmount(() => {
    emitter.off(execute)
  })
}

export type { Listener }
export {
  Emitter,
  onEmit,
}
