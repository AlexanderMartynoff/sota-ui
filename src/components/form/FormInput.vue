<template>
  <FormElement rounded :focus="focus" :label="label" :size="size" oneline>
    <template #prepend>
      <slot name="prepend"/>
    </template>
    <input v-model="text" :name="name" :readonly="readonly" type="text" class="min-w-0 p-2 box-border w-full focus:outline-none" :class="{'text-gray-400': readonly}" @focus="focus = true" @blur="focus = false"/>
    <template #append>
      <slot name="append"/>
    </template>
  </FormElement>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
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
    type: String as PropType<'sm' | 'md' | 'min-md'>,
    default: 'md'
  },
})

const text = defineModel<string | undefined>('text')
const focus = ref(false)
</script>
