<template>
  <div :data-mode="mode" class="flex gap-2.5 data-[mode='sended']:flex-row-reverse group" :class="classes">
    <div class="flex-none">
      <slot name="icon"/>
    </div>
    <div :data-mode="mode" class="flex flex-col p-3 data-[mode='received']:rounded-tl-none data-[mode='sended']:rounded-tr-none rounded-3xl mb-2 bg-gray-50 border-gray-200 border">
      <div class="flex space-x-2">
        <span class="text-sm font-semibold text-gray-900">{{name}}</span>
        <span class="text-sm font-normal text-gray-500">{{datetime}}</span>
        <span class="flex-auto"></span>
        <span :data-mode="mode" class="data-[mode='received']:hidden">
          <EnvelopeOpenIcon :data-mode="mode" class="text-blue-500 size-4"/>          
        </span>
      </div>
      <p class="text-lg font-normal text-gray-900">
        {{message}}
      </p>
    </div>
    <div class="flex flex-col items-center">
      <EllipsisHorizontalCircleIcon class="cursor-pointer invisible group-hover:visible flex size-7 text-gray-500"/>
    </div>
  </div>
</template>


<script lang="ts" setup>
import  { computed } from 'vue'
import { EllipsisHorizontalCircleIcon } from '@heroicons/vue/24/outline'
import { EyeIcon, EnvelopeIcon, EnvelopeOpenIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{name: string, message?: string, datetime: string, mode: 'sended' | 'received'}>()

const classes = computed(() => {
  return {
    'flex-row-reverse': props.mode == 'sended',
  }
})
</script>


<style lang="scss">

</style>
