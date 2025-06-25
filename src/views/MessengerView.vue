<template>
  <Layout view="shh-scc-sff">
    <LayoutHeader paddings>
      <Toolbar>
        <Button @click="onMenuBtnClick" class="hidden sm:flex" toolbar>
          <ListBulletIcon class="size-8" />
        </Button>
        <Button @click="onContactsBtnClick" class="sm:hidden" toolbar>
          <ListBulletIcon class="size-8" />
        </Button>
        <span class="flex-1 truncate font-medium">
          {{chat.name}}
        </span>
        <Button @click="onSettingsBtnClick" toolbar>
          <IdentificationIcon class="size-8" />
        </Button>
      </Toolbar>
    </LayoutHeader>

    <LayoutSidebar side="left" :visible="sidebar">
      <MessengerChatList @select="onContactSelect" :active-chat="chat"/>
    </LayoutSidebar>

    <LayoutContent>
      <Messenger :chat="chat" :sidebar="sidebar" :key="chat.id"/>
    </LayoutContent>
  </Layout>
</template>


<script lang="ts" setup>
import { ref, computed, watch, inject } from 'vue'
import type { Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChatType, type Chat, type IDB } from '../types.ts'
import { ListBulletIcon, IdentificationIcon } from '@heroicons/vue/24/solid'
import Messenger from '../components/Messenger.vue'
import Toolbar from '../components/Toolbar.vue'
import Button from '../components/Button.vue'
import MessengerChatList from '../components/MessengerChatList.vue'
import LayoutHeader from '../components/layout/LayoutHeader.vue'
import LayoutFooter from '../components/layout/LayoutFooter.vue'
import LayoutSidebar from '../components/layout/LayoutSidebar.vue'
import LayoutContent from '../components/layout/LayoutContent.vue'
import Layout from '../components/layout/Layout.vue'
import * as db from '../library/idb'


const props = defineProps<{chatId: string}>()

const router = useRouter()
const route = useRoute()

const sidebar = ref(true)

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


function onMenuBtnClick() {
  sidebar.value = !sidebar.value
}

function onContactsBtnClick() {
  router.push({name: 'contacts'})
}

function onSettingsBtnClick() {
  router.push({name: 'settings'})
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
