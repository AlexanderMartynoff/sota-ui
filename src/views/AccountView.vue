<template>
  <CropperDialog :file="avatar" @crop="onAvatarCrop" ref="cropper-dialog"/>
  <Layout view="hhh-ccc">
    <LayoutHeader padding bordered="b" class="bg-gray-100">
      <Toolbar>
        <Button @click="onContactListBtnClick" toolbar>
          <HomeIcon class="size-8"/>
        </Button>
        <span class="flex-auto"/>
        <Button toolbar @click="onLogoutBtnClick">
          <ArrowRightStartOnRectangleIcon class="size-8 mr-1"/>
        </Button>
        <Button toolbar @click="onSaveBtnClick">
          <CheckIcon class="size-8 mr-1"/>
        </Button>
      </Toolbar>
    </LayoutHeader>

    <LayoutContent scroll="auto" class="bg-gray-50" padding>
      <div class="flex flex-col items-center w-full">
        <div class="my-5 flex items-center gap-2">
          <Avatar size="xs" :file="values.avatar" :online="store.account.online"/>
          <span class="text-2xl text-gray-700 truncate">{{store.account.name}}</span>
        </div>
        <form class="max-w-lg w-full">
          <div class="mb-5">
            <FormInput label="Id" v-model:text="values.id" readonly/>
          </div>
          <div class="mb-5">
            <FormInput label="Device" v-model:text="values.deviceId" readonly/>
          </div>
          <div class="mb-5">
            <FormInput label="Login" v-model:text="values.login" size="md"/>
          </div>
          <div class="mb-5">
            <FormInput label="Secret" v-model:text="values.secret" size="md"/>
          </div>
          <div class="mb-5">
            <FormInput label="Name" v-model:text="values.name" size="md"/>
          </div>
          <div class="mb-5">
            <FormFile label="Avatar" v-model:file="avatar" @change="onAvatarChange">
              <template #icon>
                <PhotoIcon class="size-5"/>
              </template>
            </FormFile>
          </div>
          <div class="mb-5">
            <FormText label="About"/>
          </div>
        </form>
      </div>
    </LayoutContent>
  </Layout>
</template>


<script lang="ts" setup>
import { reactive, watch, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import LayoutHeader from '../components/layout/LayoutHeader.vue'
import LayoutContent from '../components/layout/LayoutContent.vue'
import Layout from '../components/layout/Layout.vue'
import Button from '../components/Button.vue'
import Toolbar from '../components/Toolbar.vue'
import FormInput from '../components/form/FormInput.vue'
import FormFile from '../components/form/FormFile.vue'
import FormText from '../components/form/FormText.vue'
import Avatar from '../components/Avatar.vue'
import CropperDialog from '../components/CropperDialog.vue'
import { HomeIcon, CheckIcon, PhotoIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useStore } from '../stores/messenger.ts'
import * as http from '../library/http.ts'
import type { Account } from '../types.ts'

const router = useRouter()
const store = useStore()

const values = reactive<Partial<Account> & {secret?: string}>({})

watch(store.account, v => {
  Object.assign(values, v)
}, { immediate: true })

const avatar = ref<File>()

watch(values, v => {
  avatar.value = v.avatar
}, { immediate: true })

const cropper = useTemplateRef('cropper-dialog')

function onAvatarChange() {
  cropper.value?.open()
}

function onSaveBtnClick() {
  if (store.account.signed) {
    store.updateAccount(store.account.id, {
      name: values.name,
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

function onLogoutBtnClick() {
  router.push({name: 'login'})
}

function onContactListBtnClick() {
  router.push({name: 'contact-list'})
}

async function onAvatarCrop(file: File) {
  values.avatar = file
  cropper.value?.close()
}
</script>
