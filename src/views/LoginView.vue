<template>
  <Layout view="hhh-ccc" class="bg-gray-50">
    <LayoutHeader padding bordered="b" class="bg-gray-100">
      <Toolbar>
        <span class="flex-auto"/>
        <Button toolbar @click="onAccountBtnClick">
          <Cog8ToothIcon class="size-8 mr-1"/>
        </Button>
        <Button toolbar @click="onLoginBtnClick">
          <ArrowRightEndOnRectangleIcon class="size-8 mr-1"/>
        </Button>
      </Toolbar>
    </LayoutHeader>
    <LayoutContent scroll="auto" padding>
      <div class="flex flex-col items-center w-full h-full">
        <form class="p-5 w-full max-w-lg rounded bg-gray-50 border border-gray-200">
          <div class="mb-5">
            <FormInput v-model:text="values.login" label="Login"/>
          </div>
          <div>
            <FormInput v-model:text="values.secret" label="Secret"/>
          </div>
        </form>
      </div>
    </LayoutContent>
  </Layout>
</template>


<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRightEndOnRectangleIcon, Cog8ToothIcon } from '@heroicons/vue/24/outline'
import LayoutHeader from '../components/layout/LayoutHeader.vue'
import LayoutContent from '../components/layout/LayoutContent.vue'
import Layout from '../components/layout/Layout.vue'
import FormInput from '../components/form/FormInput.vue'
import Toolbar from '../components/Toolbar.vue'
import Button from '../components/Button.vue'
import { useStore } from '../stores/messenger.ts'
import { signInAccount } from '../library/http'


const router = useRouter()
const store = useStore()

const values = reactive<{login?: string, secret?: string}>({})

function onAccountBtnClick() {
  router.push({name: 'account'})
}

function onLoginBtnClick() {
  if (values.login == undefined || values.secret == undefined ) {
    throw new Error('Form is empty')
  }

  signInAccount(values.login, values.secret, {
    id: store.account.deviceId,
    name: store.account.deviceName,
  }).then(r => {
    if (r.ok) {
      return r.json()
    } else {
      throw new Error()
    }
  }).then(v => {
    store.activateAccount({
      ...v,
      deviceId: store.account.deviceId,
      deviceName: store.account.deviceName,
      signed: true,
    }).then(() => {
      router.push({name: 'account'})
    })
  })
}
</script>
