<template>
  <RouterView/>
</template>


<script lang="ts" setup>
import { v4 as uuid4 } from 'uuid'
import { watch, inject } from 'vue'
import { useStore } from './stores/messenger.ts'
import { Emitter, onEmit } from './library/emitter.ts'
import { MessageStage, RecordType, ChatType, TaskStates, EventType } from './types'
import type { IDB, InputPackage, StageMessage, Message, Event, ServerError, OnMessageSendedEvent } from './types'
import { WebSocketQueue } from './library/websocket.ts'
import * as db from './library/idb'


const websocket = inject<WebSocketQueue>('websocket') as WebSocketQueue
const idb = inject<IDB>('idb') as IDB
const emitter = inject<Emitter>('emitter') as Emitter

const store = useStore()

watch(() => store.account.signed, signed => {
  if (signed && websocket.closed) {
    websocket.open()
  }
}, { immediate: true })


const onEvent = (record: InputPackage<Event>) => {
  switch (record.message.type) {
    case EventType.OnSendMessage:
      onReceiveMessageSendedEvent(record.message as OnMessageSendedEvent<Message>)
      return
  }
}

// ***
// 1. Outcome messages from other device
// ***
const onReceiveMessageSendedEvent = (event: OnMessageSendedEvent<Message>) => {
  if (event.packageType !== RecordType.UserMessage) {
    return
  }

  if (event.packageMessage.senderDeviceId === store.account.deviceId) {
    return
  }

  const message = {
    ...event.packageMessage,
    stage: MessageStage.SenderCreated,
  }

  db.run(scope => {
    if (db.getChat(scope, message.chatId) == undefined) {
      db.addChat(scope, {
        id: message.chatId,
        name: message.senderChatName,
        chanel: message.senderChatChannel,
        type: ChatType.User,
      })
    }

    db.putMessage(scope, message)
  }, idb, ['accounts', 'tasks', 'messages', 'chats'], 'readwrite').then(() => {
    emitter.emit('messages.updated', { message })
  })
}

// ***
// 2. Incoming messages
// ***
const onReceiveIncomeMessage = ({ message }: InputPackage<Message>) => {
  db.run(async scope => {
    if (await db.getAccount(scope, message.senderId) == undefined) {
      // download account later
      // db.addTask(scope, {} as Task)
    }

    if (await db.getChat(scope, message.chatId) == undefined) {
      db.addChat(scope, {
        id: message.chatId,
        name: message.senderName,
        chanel: message.senderId,
        type: ChatType.User,
      })
    }

    await db.putMessage(scope, {
      ...message,
      stage: MessageStage.ReceiverAccepted,
    })

    if (message.senderDeviceId != store.account.deviceId) {
      await db.addTask(scope, {
        id: uuid4(),
        createTime: Date.now(),
        changeStateTime: Date.now(),
        state: TaskStates.Ready,
        payload: {
          type: RecordType.StageMessage,
          chanel: message.senderId,
          message: {
            id: uuid4(),
            stage: MessageStage.ReceiverAccepted,
            messageId: message.id,
          },
        },
      })
    }
  }, idb, ['accounts', 'tasks', 'messages', 'chats'], 'readwrite').then(() => {
    emitter.emit('messages.updated', { message })
  })

  if (websocket.opened) {
    websocket.flush()
  }
}

// ***
// 3. Incoming stage messages
// ***
const onReceiveStageMessage = (record: InputPackage<StageMessage>) => {
  db.run(scope => {
    db.setMessageStage(scope, record.message)
    db.deleteTasks(scope, task => task.payload.message?.id == record.message.messageId)
  }, idb, ['messages', 'tasks'], 'readwrite').then(() => {
    emitter.emit('messages.stage.changed', record.message)
  })
}

const onServerError = async ({ message }: { message: ServerError }) => {
  console.error('Server error:', message.error)
}

const onOpen = () => {
  store.account.online = true
}

const onClose = () => {
  store.account.online = false
}

// database events
onEmit('tasks.created', () => {
  websocket.flush()
}, emitter)

// websocket events
onEmit('server-error', (event) => {
  onServerError(event)
}, websocket.emitter)

onEmit('user-message', (event) => {
  onReceiveIncomeMessage(event)
}, websocket.emitter)

onEmit('stage-message', (event) => {
  onReceiveStageMessage(event)
}, websocket.emitter)

onEmit('event', (event) => {
  onEvent(event)
}, websocket.emitter)

onEmit('websocket-open', () => {
  onOpen()
}, websocket.emitter)

onEmit('websocket-close', () => {
  onClose()
}, websocket.emitter)
</script>
