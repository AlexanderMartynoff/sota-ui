import type { IDBPDatabase } from 'idb'
import type { InputPackage, OutputPackage, CommandMessage, Message, StageMessage, Event, Heartbeat, Task } from '../types'
import { TaskStates, RecordTypes, TaskTypes } from '../types'
import { Emitter } from './emitter'
import * as db from './idb'


class WebSocketStateError extends Error { }


enum Events {
  OnError = 'onError',
  OnClose = 'onClose',
  OnOpen = 'onOpen',
}

enum CloseCode {
  Stop = 3001,
  Restart,
}

class WebSocketQueue {
  // timeout (ms) before open WS connection after abnormal closing
  private reopenTimeout: number
  private messageTimeout: number
  private heartbeatTimeout: number

  private heartbeatTimer: number = 0

  private readonly url: string
  private socket?: WebSocket
  readonly emitter: Emitter

  private readonly waiters: Map<string, {resolve: (message: any) => void, reject: (reason?: any) => void}>

  constructor(url: string, heartbeatTimeout: number = 30_000, messageTimeout: number = 30_000, reopenTimeout: number = 5_000) {
    this.url = url
    this.emitter = new Emitter()
    this.waiters = new Map()

    this.reopenTimeout = reopenTimeout
    this.messageTimeout = messageTimeout
    this.heartbeatTimeout = heartbeatTimeout

    // enter point
    this.emitter.on('websocket-open', () => {
      console.debug('[WS] Open connection')

      if (this.heartbeatTimeout > 0) {
        // immitate heartbeat message from server for sending heartbeat back to server
        console.debug('[WS] Enable heartbeat')

        this.emitter.emit('stage-message', {
          type: RecordTypes.StageMessage,
          message: {messageId: RecordTypes.HeartbeatMessage},
        })
      }
    })

    this.emitter.on('stage-message', async (pkg: InputPackage<StageMessage>) => {
      const waiter = this.waiters.get(pkg.message.messageId)

      waiter?.resolve(pkg)

      if (pkg.message.messageId != RecordTypes.HeartbeatMessage) {
        return
      }

      window.clearTimeout(this.heartbeatTimer)

      this.heartbeatTimer = window.setTimeout(() => {

        this.send({
          type: RecordTypes.HeartbeatMessage,
          message: {
            id: RecordTypes.HeartbeatMessage,
          },
        })
      }, this.heartbeatTimeout)
    })

    this.emitter.on('websocket-close', (event: CloseEvent) => {
      console.debug('[WS] Close connection', event)

      if (event.code == CloseCode.Stop) {
        return
      }

      window.setTimeout(() => {
        this.open()
      }, this.reopenTimeout)
    })
  }

  get opened() {
    return this.socket?.readyState === WebSocket.OPEN
  }

  get connecting() {
    return this.socket?.readyState === WebSocket.CONNECTING
  }

  get closing() {
    return this.socket?.readyState === WebSocket.CLOSING
  }

  get closed() {
    return !this.socket || this.socket?.readyState === WebSocket.CLOSED
  }

  open() {
    if (!this.closed) {
      throw new WebSocketStateError()
    }

    console.log('[WS] Start opening', this.url)

    this.socket = new WebSocket(this.url)

    this.socket.onopen = (event) => {
      this.emitter.emit('websocket-open', event)
    }

    this.socket.onerror = (error) => {
      this.emitter.emit('websocket-error', error)
    }

    this.socket.onclose = (event: CloseEvent) => {
      this.emitter.emit('websocket-close', event)
    }

    this.socket.onmessage = (message: MessageEvent<string>) => {
      const record = JSON.parse(message.data) as InputPackage<Message | StageMessage | Event | Heartbeat>

      console.debug(`[WS] Receive "${record.type}" message`, record)

      // user-message
      // stage-message
      // heartbeat
      // command
      this.emitter.emit(record.type, record)
    }
  }

  close(code = CloseCode.Stop, reason='clientside close') {
    if (this.closed) {
      throw new WebSocketStateError()
    }

    if (this.socket == undefined) {
      throw new Error()
    }

    this.socket.close(code, reason)

    // cleanup/stop state
    window.clearTimeout(this.heartbeatTimer)

    for (const { reject } of this.waiters.values()) {
      reject({})
    }

    this.waiters.clear()

    console.debug('[WS] Close connection', 'code', code, 'reason', reason)
  }

  send(pkg: OutputPackage<Message | StageMessage | Heartbeat | CommandMessage>, awaitable: boolean = true) {
    if (this.socket == undefined) {
      throw new Error()
    }

    this.socket.send(JSON.stringify(pkg))

    console.debug(`[WS] Write "${pkg.type}" message`, pkg)

    if (awaitable) {
      this.wait(pkg.message.id)
    }
  }

  private wait(id: string): void {
    let timer: number

    const clear = () => {
      this.waiters.delete(id)

      if (timer != undefined) {
        window.clearTimeout(timer)
      }
    }

    const reject = () => {
      clear()
      this.close(CloseCode.Restart, `Message stage overtime: ${id}`)
    }

    const resolve = () => {
      clear()
    }

    this.waiters.set(id, {resolve, reject})

    timer = window.setTimeout(() => {
      reject()
    }, this.messageTimeout)
  }
}

export {
  WebSocketQueue,
  Events,
}
