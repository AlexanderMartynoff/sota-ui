import { reactive, inject } from 'vue'
import { defineStore } from 'pinia'
import type { Account, IDB } from '../types'
import * as db from '../library/idb'
import { WebSocketQueue } from '../library/websocket'
import { v4 as uuid4 } from 'uuid'


const activeAccountIdKey = 'activeAccountId'


const useStore = defineStore('store', () => {
  const idb = inject<IDB>('idb') as IDB
  const websocket = inject<WebSocketQueue>('websocket')

  const account = reactive<Account>({
    id: uuid4(),
    deviceId: uuid4(),
    deviceName: navigator.userAgent,
  } as Account)

  const activeAccountId = localStorage.getItem(activeAccountIdKey)

  if (activeAccountId != null) {
    db.run(async scope => db.getAccount(scope, activeAccountId), idb, ['accounts'], 'readonly').then(value => {
      if (value == undefined) {
        throw new Error('Invalid user account')
      }

      Object.assign(account, value)
    })
  }

  async function activateAccount(value: Account) {
    await db.run(scope => {
      db.putAccount(scope, value)
    }, idb, ['accounts'], 'readwrite')

    Object.assign(account, value)
    localStorage.setItem(activeAccountIdKey, value.id)
  }

  async function updateAccount(accountId: string, value: Partial<Omit<Account, 'id' | 'deviceId'>>) {
    await db.run(scope => {
      db.updateAccount(scope, accountId, value)
    }, idb, ['accounts'], 'readwrite')

    Object.assign(account, value)

    // websocket.send({
    //   type: RecordType.CommandMessage,
    //   message: {
    //     id: uuid4(),
    //     command: 'account.update',
    //     args: [{...account}],
    //   },
    // })
  }

  return {
    account,
    activateAccount,
    updateAccount,
  }
})

export {
  useStore,
}
