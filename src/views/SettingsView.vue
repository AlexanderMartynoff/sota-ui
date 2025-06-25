<template>
  <Layout view="hhh-ccc">
    <LayoutHeader paddings class="bg-gray-100">
      <Toolbar>
        <Button @click="onContactListBtnClick" toolbar>
          <ChevronLeftIcon class="size-8" />
        </Button>
        <span class="flex-auto"></span>
        <Button toolbar>
          <CheckIcon class="size-8 mr-1" @click="onSaveBtnClick"/>
        </Button>
      </Toolbar>
    </LayoutHeader>

    <LayoutContent scroll="auto" class="bg-gray-50">
      <form class="max-w-lg mx-auto px-2 mt-5">
        <div class="mb-5 mt-6">
          <FormInput label="Id" v-model:text="values.id" readonly/>
        </div>
        <div class="mb-5">
          <FormInput label="Device" v-model:text="values.deviceId" readonly/>
        </div>
        <div class="mb-5">
          <FormInput label="Name" v-model:text="values.name" size="md"/>
        </div>
        <div class="mb-5">
          <FormFile label="Avatar" v-model:file="values.avatar">
            <template #icon>
              <PhotoIcon class="size-5"/>
            </template>
          </FormFile>
        </div>
        <div class="mb-5">
          <FormText label="About"/>
        </div>
      </form>
    </LayoutContent>
  </Layout>
</template>


<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

import LayoutHeader from '../components/layout/LayoutHeader.vue'
import LayoutContent from '../components/layout/LayoutContent.vue'
import Layout from '../components/layout/Layout.vue'
import Button from '../components/Button.vue'
import Toolbar from '../components/Toolbar.vue'
import FormInput from '../components/form/FormInput.vue'
import FormFile from '../components/form/FormFile.vue'
import FormText from '../components/form/FormText.vue'
import { CheckIcon, ChevronLeftIcon, PhotoIcon } from '@heroicons/vue/24/solid'
import { useStore } from '../stores/messenger.ts'
import * as http from '../library/http'
import type { Account } from '../types.ts'

const router = useRouter()
const store = useStore()

const values = reactive<Partial<Account>>({})

watch(store.account, (value) => {
  Object.assign(values, value)
}, { immediate: true })

function onSaveBtnClick() {
  // if (store.account.signed) {
  if (false) {
    store.updateAccount(store.account.id, {
      name: values.name,
      deviceName: values.deviceName,
      avatar: values.avatar,
    })
  } else {
    const account = {...store.account, ...values, signed: true, avatar: undefined}

    http.signUpAccount(account).then(() => {
      store.activateAccount(account)
    }).catch(() => {
      store.activateAccount(account)
    })
  }
}

function onContactListBtnClick() {
  router.back()
}
</script>
