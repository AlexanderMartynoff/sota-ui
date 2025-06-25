<template>
  <li class="flex items-center p-2 mb-1 cursor-pointer group border rounded-md border-transparent hover:border-gray-200 hover:bg-gray-100 data-[active=true]:bg-gray-200 data-[active=true]:border-gray-300" :data-active="active" @click="onItemClick">
    <span>
      <slot name="avatar"/>
    </span>
    <span class="flex flex-auto flex-col ms-3">
      <span class="text-gray-500 group-hover:text-gray-900 data-[active=true]:text-gray-900 font-medium" :data-active="active">{{ title }}</span>
      <span class="text-xs text-gray-400 group-hover:text-gray-900 data-[active=true]:text-gray-900" :data-active="active">
        Mauris faucibus magna eu elementum placerat
      </span>
    </span>
    <span class="ms-3">
      <!-- <EllipsisHorizontalCircleIcon class="cursor-pointer group-hover:visible flex size-6 text-gray-500"/> -->
      <span class="text-xs font-light">21:05</span>
    </span>
  </li>
</template>


<script lang="ts" setup>
import { EllipsisHorizontalCircleIcon } from '@heroicons/vue/24/outline'

const emits = defineEmits(['click'])

defineProps<{ title: string, active?: boolean }>()

function onItemClick() {
  emits('click')
}
</script>
