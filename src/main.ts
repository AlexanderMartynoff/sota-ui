import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import * as database from './database.ts'
import { WebSocketQueue } from './library/websocket.ts'
import { Emitter } from './library/emitter.ts'
import Main from './Main.vue'
import router from './router'

const app = createApp(Main)

const idb = await database.setup()
const websocket = new WebSocketQueue(`ws://${location.host}/v1/serve`, idb, 10_000, 10_000)

app.provide('idb', idb)
app.provide('websocket', websocket)
app.provide('emitter', new Emitter())

app.use(createPinia())
app.use(router)

app.mount('#root')
