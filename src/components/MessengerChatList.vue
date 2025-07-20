<template>
  <Layout view="hhh-ccc">
    <LayoutHeader padding :class="{'hidden': !search}" bordered="b">
      <Toolbar mode="justify-between">
        <FormInput v-model:text="filter" size="md">
          <template #prepend>
            <Button class="w-13">
              <ClockIcon class="text-gray-400 flex size-5" :class="{'!text-blue-400 animate-spin': pending}"/>
            </Button>
          </template>
        </FormInput>
      </Toolbar>
    </LayoutHeader>
    <LayoutContent scroll="auto">
      <Menu>
        <MenuItem :title="chat.name" :active="chat.id === activeChat?.id" :caption="chat.caption?.text" v-for="chat in chats" @click="onMenuItemClick(chat)">
          <template #prepend>
            <UserCircleIcon class="size-11 text-gray-400"/>
          </template>
          <template #append>
            <span class="text-xs text-gray-400">
              {{chat.caption?.time ? format(chat.caption.time, 'HH:mm:ss') : '--:--'}}
            </span>
          </template>
        </MenuItem>
      </Menu>
    </LayoutContent>
  </Layout>
</template>


<script lang="ts" setup>
import { computed, ref, watch, inject } from 'vue'
import { format } from 'date-fns'
import { UserCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'
import Layout from '../components/layout/Layout.vue'
import Toolbar from '../components/Toolbar.vue'
import Button from '../components/Button.vue'
import Menu from '../components/Menu.vue'
import MenuItem from '../components/MenuItem.vue'
import LayoutHeader from '../components/layout/LayoutHeader.vue'
import LayoutContent from '../components/layout/LayoutContent.vue'
import FormInput from '../components/form/FormInput.vue'
import { hash } from '../library/functions.ts'
import { useStore } from '../stores/messenger.ts'
import type { Chat, User, IDB, ChatRelations } from '../types.ts'
import { Emitter, onEmit } from '../library/emitter.ts'
import  { ChatType } from '../types.ts'
import { FetchDebouncer } from '../library/fetch-debouncer.ts'
import * as db from '../library/idb'


const idb = inject<IDB>('idb') as IDB
const emitter = inject<Emitter>('emitter') as Emitter

defineProps<{activeChat?: Chat, search: boolean}>()

const emit = defineEmits(['select'])

const pending = ref(false)

const debouncer = new FetchDebouncer({
  onrequest: () => {
    remoteUsers.value = []
    remoteChats.value = []
    pending.value = true
  },

  onresult: ({ users, chats }: { users: User[], chats: Chat[] }) => {
    remoteUsers.value = users || []
    remoteChats.value = chats || []
    pending.value = false
  },

  onerror: (error: Error) => {
    remoteUsers.value = []
    remoteChats.value = []
    pending.value = false
  },
})

const filter = defineModel<string | undefined>()
const store = useStore()

const remoteUsers = ref<User[]>([])
const remoteChats = ref<Chat[]>([])
const localChats = ref<Array<Chat & ChatRelations>>([])


watch(filter, v => {
  onChatsStoreChange()

  if (v) {
    debouncer.request(`/v1/api/chat-search?name=${v}`)
  } else {
    debouncer.abort()
  }
}, { immediate: true })

function onMenuItemClick(contact: {name: string}) {
  emit('select', contact)
}

async function onChatsStoreChange() {
  localChats.value = await db.run(scope => {
    return db.selectChats(scope, chat => filter.value?.length ? chat.name.toLowerCase().indexOf(filter.value.toLowerCase()) >= 0 : true)
  }, idb, ['chats', 'messages', 'accounts'], 'readonly')
}

onEmit(['chats.deleted', 'chats.created', 'chats.updated'], () => {
  onChatsStoreChange()
}, emitter)

onEmit(['messages.updated', 'messages.created', 'messages.deleted'], () => {
  onChatsStoreChange()
}, emitter, 1000)

const chats = computed(() => {
  const chats: Array<ChatRelations & Chat> = []

  for (const localChat of localChats.value) {
    chats.push(localChat)
  }

  for (const remoteUser of remoteUsers.value) {
    const localUserChat = chats.find(chat => chat.chanel == remoteUser.id)

    if (localUserChat) {
      continue
    }

    chats.push({
      id: hash(store.account.id, remoteUser.id),
      name: remoteUser.name,
      chanel: remoteUser.id,
      type: ChatType.User,
    })
  }

  return chats
})


</script>
