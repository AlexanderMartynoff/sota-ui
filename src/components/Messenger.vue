<template>
  <Layout view="hhh-ccc-fff" class="x-messenger">
    <LayoutContent ref="scrolling" :key="chat.id" scroll="auto" class="bg-gray-50">
      <MessengerMessage :name="message.senderName" :message="message.text" datetime="00:00" mode="sended" v-for="message in messages" :key="message.id" v-memo="[message.stage, message.text]">
        <template #icon>
          <UserCircleIcon class="text-gray-300 size-12"/>
        </template>
      </MessengerMessage>

      <template #sticky>
        <LayoutContentSticker @click="onToDownBtnClick" :class="{'hidden': !sticker}"/>
      </template>
    </LayoutContent>

    <LayoutFooter bordered class="bg-gray-100">
      <MessengerToolbar @send-btn-click="onSendBtnClick"/>
    </LayoutFooter>
  </Layout>
</template>


<script lang="ts" setup>
import { v4 as uuid4 } from 'uuid'
import { ref, inject, nextTick, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { UserCircleIcon } from '@heroicons/vue/24/solid'
import type { Chat, IDB, MessageRelations, Message } from '../types.ts'
import { TaskStates, RecordType, MessageStage } from '../types.ts'
import { Emitter, onEmit } from '../library/emitter.ts'
import { Scroller } from '../library/scroller.ts'
import * as db from '../library/idb'
import { useStore } from '../stores/messenger'
import Layout from './layout/Layout.vue'
import LayoutFooter from './layout/LayoutFooter.vue'
import LayoutContent from './layout/LayoutContent.vue'
import MessengerMessage from './MessengerMessage.vue'
import MessengerToolbar from './MessengerToolbar.vue'
import LayoutContentSticker from './layout/LayoutContentSticker.vue'


const props = defineProps<{sidebar?: boolean, chat: Chat }>()

const store = useStore()
const scrolling = useTemplateRef('scrolling')

const idb = inject<IDB>('idb') as IDB
const emitter = inject<Emitter>('emitter') as Emitter
const scroller = new Scroller()

const limit = ref(0)
const sticker = ref(false)

const messages = ref<Array<Message & MessageRelations>>([])

function selectMessages() {
  if (props.chat?.id == undefined || limit.value == 0) {
    return {records: [], finish: false}
  }

  return db.run(scope => db.selectMessages(scope, props.chat.id, limit.value), idb, [
    'messages',
    'chats',
    'accounts',
  ], 'readonly')
}


async function onMessagesStoreChange() {
  const { records } = await selectMessages()

  messages.value = records

  nextTick().then(() => {
    scroller.toStartPosition()
  })
}

async function onSendBtnClick({ text }: {text: string}) {
  const message = {
    id: uuid4(),
    chatId: props.chat.id,
    senderId: store.account.id,
    senderDeviceId: store.account.deviceId,
    senderName: store.account.name,
    senderChatName: props.chat.name,
    senderChatChannel: props.chat.chanel,
    stage: MessageStage.SenderCreated,
    createTime: Date.now(),
    text,
  }

  const task = {
    id: uuid4(),
    state: TaskStates.Ready,
    changeStateTime: Date.now(),
    createTime: Date.now(),
    payload: {
      message,
      type: RecordType.UserMessage,
      chanel: props.chat.chanel,
    },
  }

  await db.run(async (scope, tx) => {
    // 1. add chat if missing
    if (await db.getChat(scope, props.chat.id) == undefined) {
      db.addChat(scope, {...props.chat})

      tx.done.then(() => {
        emitter.emit('chats.created', { chat: props.chat })
      })
    }

    // 2. add message
    db.addMessage(scope, message)

    // 3. add tasks for sending message with WS
    db.addTask(scope, task)
  }, idb, ['tasks', 'messages', 'chats'], 'readwrite')

  emitter.emit('tasks.created', { task })
  emitter.emit('messages.created', { message, chat: props.chat })
}

function onToDownBtnClick() {
  scroller.toStartPosition()
}

onEmit([
  'messages.stage.changed',
  'account.updated',
  'messages.updated',
  'messages.created',
  'messages.deleted'
], (event) => {
  onMessagesStoreChange()
}, emitter)


onMounted(() => {
  if (scrolling.value?.element == undefined) {
    return
  }

  scroller.attach(scrolling.value.element, async (start, stop) => {
    limit.value += 25

    const { records, finish } = await selectMessages()

    // before DOM and scroll change
    // remember scroll container state
    start()

    // change data
    messages.value = records

    // await for DOM change
    nextTick().then(() => {
      stop(finish)
    })
  }, (scrollTop, scrollBottom) => {
    sticker.value = scrollBottom > 1
  })
})

onUnmounted(() => {
  scroller.detach()
})
</script>
