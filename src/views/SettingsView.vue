<template>
  <Layout view="hhh-ccc">
    <LayoutHeader paddings>
      <Toolbar>
        <Button toolbar>
          <ListBulletIcon class="size-8" @click="onContactListBtnClick"/>
        </Button>
        <span class="flex-auto"></span>
        <Button toolbar>
          <CloudArrowUpIcon class="size-8" />
        </Button>
      </Toolbar>
    </LayoutHeader>

    <LayoutContent paddings>
      <form class="max-w-md mx-auto p-3">
        <div class="mb-3">
          <Input type="text" label="Id" rounded/>
        </div>
        <div class="mb-3">
          <Input type="text" label="Name" rounded/>
        </div>
        <div class="mb-3">
          <Input type="text" label="Device" rounded/>
        </div>
        <div class="mb-3">
          <Input type="file" label="Avatar" rounded>
            <template #left>
              <PaperClipIcon class="size-8"/>
            </template>
          </Input>
        </div>
      </form>
    </LayoutContent>
  </Layout>
</template>


<script lang="ts" setup>
import { useRouter } from 'vue-router'

import LayoutHeader from '../components/layout/LayoutHeader.vue'
import LayoutContent from '../components/layout/LayoutContent.vue'
import Layout from '../components/layout/Layout.vue'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'
import InputFile from '../components/InputFile.vue'
import Toolbar from '../components/Toolbar.vue'
import { PaperClipIcon, ListBulletIcon, NumberedListIcon, CloudArrowUpIcon } from '@heroicons/vue/24/solid'


const router = useRouter()

function onContactListBtnClick() {
  router.push({ name: 'contacts' })
}
</script>
