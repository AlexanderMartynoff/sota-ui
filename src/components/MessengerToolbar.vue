<template>
  <Toolbar class="p-1">
    <Input type="textarea" class="flex-auto" rounded v-model:text="text" @right-btn-click="onSendBtnClick" ref="element">
      <template #right>
        <PaperAirplaneIcon class="size-8"/>
      </template>
    </Input>
  </Toolbar>
</template>


<script lang="ts" setup>
import { ref, useTemplateRef, onMounted, onBeforeUnmount } from 'vue'
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'
import Toolbar from '../components/Toolbar.vue'
import Input from '../components/Input.vue'

const emit = defineEmits(['send-btn-click'])

let shift = ref(false)

function onKeyDown(event: KeyboardEvent) {
  if (event.code == 'ShiftLeft') {
    shift.value = true
  }

  if (event.code == 'Enter' && !shift.value) {
    event.preventDefault()
    onSendBtnClick()
  }
}


function onKeyUp(event: KeyboardEvent) {
  if (event.code == 'ShiftLeft') {
    shift.value = false
  }
}

const element = useTemplateRef('element')

onMounted(() => {
  element.value?.element?.addEventListener('keydown', onKeyDown)
  element.value?.element?.addEventListener('keyup', onKeyUp)
})

onBeforeUnmount(() => {
  element.value?.element?.removeEventListener('keydown', onKeyDown)
  element.value?.element?.removeEventListener('keyup', onKeyUp)
})

let text = ref<string | undefined>()

function onSendBtnClick() {
  if (!text.value) {
    return
  }

  emit('send-btn-click', {
    text: text.value,
  })

  text.value = undefined
}
</script>
