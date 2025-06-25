<template>
  <li class="flex items-center p-2 mb-1 cursor-pointer group border rounded-md border-transparent hover:border-gray-300 hover:bg-gray-200 data-[active=true]:bg-gray-200 data-[active=true]:border-gray-300" :data-active="active" @click="onItemClick">
    <span>
      <slot name="avatar"/>
    </span>
    <span class="flex flex-auto flex-col ms-3 overflow-hidden">
      <span class="text-gray-500 group-hover:text-gray-900 data-[active=true]:text-gray-900 font-medium truncate" :data-active="active">
        {{ title }}
      </span>
      <span class="text-xs text-gray-400 group-hover:text-gray-900 data-[active=true]:text-gray-900 truncate" :data-active="active">
        {{ caption }}
      </span>
    </span>
    <span class="ms-3 flex justify-center">
      <span class="text-xs flex flex-col justify-center">21:05</span>
      <EllipsisVerticalIcon class="cursor-pointer invisiblee size-7 text-gray-500"/>
    </span>
  </li>
</template>


<script lang="ts" setup>
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

const emits = defineEmits(['click'])

defineProps<{ title: string, active?: boolean, caption?: string }>()

function onItemClick() {
  emits('click')
}
</script>
