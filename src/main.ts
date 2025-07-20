import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Main from './Main.vue'
import router from './router'
import * as database from './database.ts'
import { WebSocketQueue } from './library/websocket.ts'
import { Emitter } from './library/emitter.ts'


const app = createApp(Main)
const pinia = createPinia()

app.use(pinia)
app.use(router)


database.setup().then(idb => {
  const websocket = new WebSocketQueue(`ws://${location.host}/v1/serve`, idb, 30_000, 30_000)
  const emitter = new Emitter()

  app.provide('idb', idb)
  app.provide('websocket', websocket)
  app.provide('emitter', emitter)

  app.mount('#root')
})
