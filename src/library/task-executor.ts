import type { IDBPDatabase } from 'idb'
import * as db from './idb'
import { TaskTypes, TaskStates } from '../types'
import type { Task } from '../types'


type ActionExecutor = (idb: IDBPDatabase<any>, task: Task) => void

type Action = {
  execute: ActionExecutor,
  type: TaskTypes,
}

class TaskExecutor {
  private readonly idb: IDBPDatabase<any>
  private readonly timeout: number
  private readonly actions: Action[]

  constructor(idb: IDBPDatabase<any>, actions: Action[], timeout = 20_000) {
    this.idb = idb
    this.timeout = timeout
    this.actions = actions
  }

  async flush() {
    await db.run(async scope => {
      for await (const { task, update } of db.selectTasks(scope, this.timeout, [TaskTypes.SendMessage, TaskTypes.LoadAccount])) {
        const action = this.find(task.type)

        if (action == undefined) {
          throw new Error(`action "${task.type}" not found`)
        }

        action.execute(this.idb, task)

        update({
          state: TaskStates.Await,
        })
      }
    }, this.idb, ['tasks'], 'readwrite')
  }

  private find(type: TaskTypes): Action | undefined {
    for (const action of this.actions) {
      if (action.type == type) {
        return action
      }
    }
  }
}

export { TaskExecutor }
export type { ActionExecutor, Action }
