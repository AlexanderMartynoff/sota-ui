<template>
  <Layout view="hhh-ccc">
    <LayoutHeader paddings class="bg-gray-100">
      <Toolbar>
        <Button toolbar>
          <MagnifyingGlassIcon class="size-8" @click="search = !search"/>
        </Button>
        <span class="flex-auto"/>
        <Button toolbar>
          <Cog8ToothIcon @click="onSettingsBtnClick" class="size-8" />
        </Button>
      </Toolbar>
    </LayoutHeader>

    <LayoutContent scroll="auto">
      <MessengerContactList @select="onChatSelect" :search="search" class="bg-gray-50"/>
    </LayoutContent>
  </Layout>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MessengerContactList from '../components/MessengerChatList.vue'
import LayoutHeader from '../components/layout/LayoutHeader.vue'
import LayoutContent from '../components/layout/LayoutContent.vue'
import Layout from '../components/layout/Layout.vue'
import Button from '../components/Button.vue'
import Toolbar from '../components/Toolbar.vue'
import { Cog8ToothIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid'


const router = useRouter()
const search = ref(false)

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

function onSettingsBtnClick() {
  router.push({name: 'settings'})
}
</script>
