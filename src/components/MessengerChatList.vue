<template>
  <Layout view="hhh-ccc">
    <LayoutHeader paddings>
      <Toolbar mode="justify-between">
        <Input type="text" class="flex-auto" rounded v-model:text="filter">
          <template #left>
            <FunnelIcon class="size-8"/>
          </template>
          <template #right>
            <MagnifyingGlassIcon class="size-8"/>
          </template>
        </Input>
      </Toolbar>
    </LayoutHeader>
    <LayoutContent>
      <Menu>
        <MenuItem :title="chat.name" :active="chat.id === activeChat?.id" v-for="chat in chats" @click="onMenuItemClick(chat)">
          <template #avatar>
            <UserCircleIcon class="size-11 text-gray-300"/>
          </template>
        </MenuItem>
      </Menu>
    </LayoutContent>
  </Layout>
</template>


<script lang="ts" setup>
import { computed, ref, watch, inject, onMounted } from 'vue'
import type { Ref } from 'vue'
import { UserCircleIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import Layout from '../components/layout/Layout.vue'
import Toolbar from '../components/Toolbar.vue'
import Menu from '../components/Menu.vue'
import MenuItem from '../components/MenuItem.vue'
import LayoutHeader from '../components/layout/LayoutHeader.vue'
import LayoutContent from '../components/layout/LayoutContent.vue'
import Input from '../components/Input.vue'
import { hash } from '../library/functions.ts'
import { useStore } from '../stores/messenger.ts'
import type { Chat, User, IDB } from '../types.ts'
import { Emitter, onEmit } from '../library/emitter.ts'
import  { ChatType } from '../types.ts'
import { FetchDebouncer } from '../library/fetch-debouncer.ts'
import * as db from '../library/idb'



const idb = inject<IDB>('idb') as IDB
const emitter = inject<Emitter>('emitter') as Emitter

const props = defineProps<{activeChat?: Chat}>()


const emit = defineEmits(['select'])

const filter = defineModel<string | undefined>()
const store = useStore()

const remoteUsers = ref<User[]>([])
const remoteChats = ref<Chat[]>([])
const localChats = ref<Chat[]>([])

watch(filter, v => {
  onChatsStoreChange()
}, { immediate: true })

function onMenuItemClick(contact: {name: string}) {
  emit('select', contact)
}

async function onChatsStoreChange() {
  localChats.value = await db.run(scope => {
    return db.selectChats(scope, chat => filter.value?.length ? chat.name.toLowerCase().indexOf(filter.value.toLowerCase()) >= 0 : true)
  }, idb, ['chats', 'messages', 'accounts'], 'readonly')
}

const chats = computed(() => {
  const chats: Chat[] = [
    // { id: '1', type: ChatType.User, chanel: '1', name: 'Alexander' },
    // { id: '2', type: ChatType.User, chanel: '2', name: 'Julia' },
    // { id: '3', type: ChatType.User, chanel: '3', name: 'Chuck' },
    // { id: '4', type: ChatType.User, chanel: '4', name: 'Bob' },
    // { id: '5', type: ChatType.User, chanel: '5', name: 'Tony' },
    // { id: '6', type: ChatType.User, chanel: '6', name: 'Brown' },
    // { id: '7', type: ChatType.User, chanel: '7', name: 'Jack' },
  ]

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


const debouncer = new FetchDebouncer({
  onrequest: () => {
    remoteUsers.value = []
    remoteChats.value = []
  },

  onresult: ({ users, chats }: { users: User[], chats: Chat[] }) => {
    remoteUsers.value = users || []
    remoteChats.value = chats || []
  },

  onerror: (error: Error) => {
    remoteUsers.value = []
    remoteChats.value = []
  },
})


</script>


<style lang="scss">

</style>
