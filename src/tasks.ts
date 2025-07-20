import { TaskTypes } from './types'
import type { IDB, Task, InputPackage, StageMessage } from './types'
import { fetchAccount } from './library/http'
import { putAccount, deleteTasks } from './library/idb/repository'
import type { Action } from './library/task-executor.ts'
import * as db from './library/idb'
import { WebSocketQueue } from './library/websocket.ts'
import { Emitter } from './library/emitter.ts'


class LoadAccount implements Action {
  get type() {
    return TaskTypes.LoadAccount
  }

  async execute(idb: IDB, task: Task) {
    const account = await fetchAccount(task.payload.id)

    if (account) {
      db.run(async scope => {
        await putAccount(scope, account)
        await deleteTasks(scope, record => record.id == task.id)
      }, idb, ['tasks', 'accounts'], 'readwrite')
    }
  }
}

class SendMessage implements Action {
  private readonly websocket: WebSocketQueue

  constructor(idb: IDB, emitter: Emitter, websocket: WebSocketQueue) {
    this.websocket = websocket

    this.websocket.emitter.on('stage-message', (record: InputPackage<StageMessage>) => {
      db.run(scope => {
        db.setMessageStage(scope, record.message)
        db.deleteTasks(scope, task => task.payload?.message?.id == record.message.messageId)
      }, idb, ['messages', 'tasks'], 'readwrite').then(() => {
        emitter.emit('messages.stage.changed', record.message)
      })
    })
  }

  get type() {
    return TaskTypes.SendMessage
  }

  async execute(idb: IDB, task: Task) {
    this.websocket.send(task.payload)
  }
}

export {
  SendMessage,
  LoadAccount,
}
