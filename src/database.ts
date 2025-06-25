import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'
import type { App } from 'vue'


function setup_v1(idb: IDBPDatabase) {
  // Chats
  const chats = idb.createObjectStore('chats', {
    keyPath: 'id',
    autoIncrement: false,
  })

  chats.createIndex('name', ['name'])
  chats.createIndex('id', ['id'])

  // Messages
  const messages = idb.createObjectStore('messages', {
    keyPath: 'id',
    autoIncrement: false,
  })

  messages.createIndex('chat+sequence', ['chatId', 'sequence'])

  // Tasks
  idb.createObjectStore('tasks', {
    keyPath: 'id',
    autoIncrement: true,
  })

  // Files
  const files = idb.createObjectStore('files', {
    keyPath: 'id',
    autoIncrement: false,
  })

  // Accounts
  const accounts = idb.createObjectStore('accounts', {
    keyPath: 'id',
    autoIncrement: false,
  })

  accounts.createIndex('id', ['id'])
}


async function setup() {
  const idb = await openDB('messenger', 1, {
    upgrade(idb, fromVersion, toVersion) {
      switch (fromVersion) {
        case 0:
          setup_v1(idb)
          break
      }
    },
  })

  return idb
}

export { setup }
