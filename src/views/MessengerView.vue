<template>
  <Layout view="shh-scc-sff">
    <LayoutHeader padding class="bg-gray-100" bordered="b">
      <Toolbar>
        <Button @click="onContactsBtnClick" class="@2xl:hidden" toolbar>
          <ChevronDoubleLeftIcon class="size-8"/>
        </Button>

        <span class="flex-1 truncate font-medium *:align-middle">
          <UserCircleIcon class="text-gray-400 size-10 mx-2 inline" /> 
          <span>
            {{chat.name}}
          </span>
        </span>
        <Button @click="onAccountBtnClick" class="*:size-8" toolbar>
          <Cog8ToothIcon />
        </Button>
      </Toolbar>
    </LayoutHeader>

    <LayoutSidebar side="left" visible>
      <MessengerChatList @select="onContactSelect" :active-chat="chat" search class="bg-gray-100"/>
    </LayoutSidebar>

    <LayoutContent scroll="auto">
      <Messenger :chat="chat" sidebar :key="chat.id"/>
    </LayoutContent>
  </Layout>
</template>


<script lang="ts" setup>
import { ref, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChatType, type Chat, type IDB } from '../types.ts'
import { UserCircleIcon, ChevronDoubleLeftIcon, Cog8ToothIcon } from '@heroicons/vue/24/outline'
import Messenger from '../components/Messenger.vue'
import Toolbar from '../components/Toolbar.vue'
import Button from '../components/Button.vue'
import MessengerChatList from '../components/MessengerChatList.vue'
import LayoutHeader from '../components/layout/LayoutHeader.vue'
import LayoutSidebar from '../components/layout/LayoutSidebar.vue'
import LayoutContent from '../components/layout/LayoutContent.vue'
import Layout from '../components/layout/Layout.vue'
import * as db from '../library/idb'


const props = defineProps<{chatId: string}>()

const router = useRouter()
const route = useRoute()

const idb = inject<IDB>('idb') as IDB

const chat = ref<Chat>({
  id: '0',
  name: '0',
  chanel: '0',
  type: ChatType.User,
})

watch(() => props.chatId, async () => {
  const value = await db.run(scope => db.getChat(scope, props.chatId), idb, ['chats'], 'readonly')

  if (value) {
    chat.value = value
    return
  }

  for (const name of ['id', 'name', 'type', 'chanel']) {
    if (typeof route.query[name] != 'string') {
      chat.value = {
        id: '0',
        name: '0',
        chanel: '0',
        type: ChatType.User,
      }
      return
    }
  }

  chat.value = {
    id: route.query.id as string,
    name: route.query.name as string,
    type: route.query.type as ChatType,
    chanel: route.query.chanel as string
  }
}, { immediate: true })


function onContactsBtnClick() {
  router.push({name: 'contact-list'})
}

function onAccountBtnClick() {
  router.push({name: 'account'})
}

function onContactSelect(chat: Chat) {
  router.push({
    name: 'messenger',
    params: {
      chatId: chat.id,
    },
    query: {
      id: chat.id,
      name: chat.name,
      chanel: chat.chanel,
      type: chat.type,
    },
  })
}
</script>
