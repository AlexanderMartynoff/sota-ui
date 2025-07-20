import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Main from './Main.vue'
import router from './router'
import * as database from './database.ts'
import { WebSocketQueue } from './library/websocket.ts'
import { Emitter } from './library/emitter.ts'
import { TaskExecutor } from './library/task-executor.ts'
import { LoadAccount, SendMessage } from './tasks.ts'

const app = createApp(Main)
const pinia = createPinia()

app.use(pinia)
app.use(router)

database.setup().then(idb => {
  const websocket = new WebSocketQueue(`ws://${location.host}/v1/serve`, 30_000, 30_000)
  const emitter = new Emitter()
  const executor = new TaskExecutor(idb, [new LoadAccount(), new SendMessage(idb, emitter, websocket)])

  app.provide('idb', idb)
  app.provide('websocket', websocket)
  app.provide('emitter', emitter)
  app.provide('executor', executor)

  app.mount('#root')
})
