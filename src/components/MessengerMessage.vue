<template>
  <div :data-mode="mode" class="flex gap-2 data-[mode='sended']:flex-row-reverse group m-2">
    <div class="flex-none">
      <slot name="icon" />
    </div>
    <div :data-mode="mode" class="overflow-x-auto flex flex-col p-4 data-[mode='received']:rounded-tl-none data-[mode='sended']:rounded-tr-none rounded-3xl bg-white border-blue-200 border">
      <div class="flex space-x-2 overflow-x-auto">
        <span class="text-sm font-semibold text-gray-900">
          {{name}}
        </span>
        <span class="text-sm font-normal text-gray-500">
          {{format(datetime, 'HH:mm:ss')}}
        </span>
        <span class="flex-auto"></span>
        <span :data-mode="mode" class="data-[mode='received']:hidden size-4" :title="stage">
          <EnvelopeOutlineIcon class="text-gray-500" v-if="stage == MessageStage.SenderCreated"/>
          <EnvelopeIcon class="text-gray-500" v-else-if="stage == MessageStage.ServerAccepted"/>
          <EnvelopeIcon class="text-blue-500" v-else-if="stage == MessageStage.ReceiverAccepted"/>
          <EnvelopeOpenIcon class="text-blue-500" v-else-if="stage == MessageStage.ReceiverReaded"/>
        </span>
      </div>
      <p class="text-lg font-normal text-gray-900 overflow-x-auto flex-auto break-normal break-words whitespace-normal">
        {{message}}
      </p>
    </div>
    <div class="flex flex-col">
      <EllipsisVerticalIcon class="cursor-pointer mt-3 invisiblee size-7 text-gray-500"/>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { EnvelopeOpenIcon, EnvelopeIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/solid'
import { EnvelopeIcon as EnvelopeOutlineIcon } from '@heroicons/vue/24/outline'
import { MessageStage } from '../types.ts'
import { format } from 'date-fns'

defineProps<{
  name: string,
  message?: string,
  datetime: number,
  mode: 'sended' | 'received',
  stage: MessageStage,
}>()
</script>
