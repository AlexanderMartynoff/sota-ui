<template>
  <Toolbar class="x-toolbar p-1">
    <FormText ref="input" @input="value => text = value">
      <template #append>
        <Button class="w-13 h-full flex" @click="onSendBtnClick">
          <PaperAirplaneIcon class="size-10"/>
        </Button>
      </template>
    </FormText>
  </Toolbar>
</template>


<script lang="ts" setup>
import { ref, useTemplateRef, onMounted, onBeforeUnmount } from 'vue'
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'
import Toolbar from '../components/Toolbar.vue'
import FormText from '../components/form/FormText.vue'
import Button from './Button.vue'

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

const input = useTemplateRef('input')

onMounted(() => {
  input.value?.element?.addEventListener('keydown', onKeyDown)
  input.value?.element?.addEventListener('keyup', onKeyUp)
})

onBeforeUnmount(() => {
  input.value?.element?.removeEventListener('keydown', onKeyDown)
  input.value?.element?.removeEventListener('keyup', onKeyUp)
})

const text = ref<string>()

function onSendBtnClick() {
  if (!text.value) {
    return
  }

  emit('send-btn-click', {
    text: text.value,
  })

  text.value = undefined

  if (input.value?.element) {
    while (input.value.element.firstChild) {
      input.value.element.removeChild(input.value.element.firstChild)
    }
  }
}
</script>
