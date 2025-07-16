<template>
  <FormElement rounded :label="label" class="group cursor-pointer" :size="size" oneline @click="onClick">
    <template #prepend>
      <div class="flex flex-none px-3 text-gray-600 group-hover:text-gray-900">
        <slot name="icon"/>
      </div>
    </template>
    <div class="py-3 box-border size-full z-0 flex items-center overflow-hidden">
      <span v-if="file?.name" class="truncate">
        {{file.name}}
      </span>
      <span class="text-gray-600 text-sm" v-else>
      </span>
    </div>
    <input type="file" :name="name" @change="onChange" ref="element" class="p-3 box-border w-full opacity-0 z-1 hidden"/>
  </FormElement>
</template>


<script lang="ts" setup>
import { useTemplateRef } from 'vue'
import type { PropType } from 'vue'
import FormElement from './FormElement.vue'


defineProps({
  name: {
    type: String,
  },
  rounded: {
    type: Boolean,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
  },
  size: {
    type: String as PropType<'sm' | 'md'>,
    default: 'md'
  },
})

const file = defineModel<File>('file')
const element = useTemplateRef('element')

function onClick() {
  element.value?.click()
}

const emits = defineEmits(['change'])

function onChange(event: Event) {
  const element = event.target as HTMLInputElement

  if (element.files == null || element.files.length == 0) {
    return
  }

  file.value = element.files[0]

  emits('change', file.value)
}
</script>
