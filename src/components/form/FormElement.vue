<template>
  <div class="flex flex-col flex-auto max-w-full box-border relative">
    <label :for="name" class="text-xs text-gray-600 !border-b-gray-100 rounded-t border bg-white border-gray-300 data-[focus='true']:border-blue-400 p-1" :data-focus="focus" v-if="label">
      {{label}}
    </label>
    <div class="x-input flex justify-items-center items-center box-border border bg-white text-gray-900 text-md border-gray-300 data-[focus='true']:border-blue-400" :class="[{'rounded-b': rounded, 'rounded-t': rounded && !label, 'border-t-0': label}, sizes[size]]" :data-focus="focus">
      <slot name="prepend"/>

      <div class="flex flex-auto overflow-hidden relative z-1 truncate">
        <slot name="default"/>
      </div>

      <slot name="append"/>
    </div>
  </div>
</template>


<script lang="ts" setup>
import type { PropType } from 'vue'

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
    default: 'auto'
  },
})

const sizes = {
  'sm': ['h-11'],
  'md': ['h-13'],
  'min-md': ['min-h-13'],
  'min-lg': ['min-h-18'],
  'auto': [],
}
</script>
