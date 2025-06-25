<template>
  <FormElement rounded :focus="focus" :label="label" :size="size">
    <template #prepend>
      <slot name="prepend"/>
    </template>
    <div contenteditable="true" class="min-w-0 p-3 overflow-y-auto text-wrap box-border w-full max-h-48 focus:outline-none" ref="element" @focus="focus = true" @blur="focus = false" @input="(event: any) => onInput(event)"></div>
    <template #append>
      <slot name="append"/>
    </template>
  </FormElement>
</template>


<script lang="ts" setup>
import { useTemplateRef, ref } from 'vue'
import type { PropType } from 'vue'
import FormElement from './FormElement.vue'


defineProps({
  name: {
    type: String,
  },
  rounded: {
    type: Boolean,
  },
  label: {
    type: String,
  },
  focus: {
    type: Boolean,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'auto' | 'min-md' | 'min-lg'>,
    default: 'min-md'
  },
})

const emits = defineEmits(['input'])

const element = useTemplateRef('element')
const focus = ref(false)

function onInput(event: {target: HTMLElement}) {
  emits('input', event.target.innerText)
}

defineExpose({
  element,
})
</script>
