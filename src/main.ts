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
  app.provide('idb', idb)
  app.provide('websocket', new WebSocketQueue(`ws://${location.host}/v1/serve`, idb, 10000, 10000))
  app.provide('emitter', new Emitter())

  app.mount('#root')
})
