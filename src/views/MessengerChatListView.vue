<template>
  <Layout view="hhh-ccc">
    <LayoutHeader paddings>
      <Toolbar>
        <span class="flex-auto"/>
        <Button toolbar>
          <UserCircleIcon class="size-10" />
        </Button>
      </Toolbar>
    </LayoutHeader>

    <LayoutContent>
      <MessengerContactList @select="onChatSelect"/>
    </LayoutContent>
  </Layout>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import MessengerContactList from '../components/MessengerChatList.vue'
import LayoutHeader from '../components/layout/LayoutHeader.vue'
import LayoutContent from '../components/layout/LayoutContent.vue'
import Layout from '../components/layout/Layout.vue'
import Button from '../components/Button.vue'
import Toolbar from '../components/Toolbar.vue'
import { UserCircleIcon, UsersIcon } from '@heroicons/vue/24/solid'


const router = useRouter()

function onChatSelect(chat: any) {
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
