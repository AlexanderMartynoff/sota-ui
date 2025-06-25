<template>
  <div class="flex flex-col">
    <label :for="name" class="mb-1 text-md font-medium" v-if="label">{{label}}</label>
    <div class="x-input flex justify-items-center items-center box-border border bg-gray-50 text-gray-900 text-md border-gray-300 h-13" :class="{'rounded-sm': rounded}">
      <Button class="w-13" v-if="slots.left">
        <slot name="left"/>
      </Button>

      <div class="flex flex-auto">
        <component :is="tag" :value="text" @input="onInput" :name="name" :type="type" class="resize-none w-full p-3 box-border" ref="element" rows="1"></component>
      </div>

      <Button class="w-13 h-full" v-if="slots.right" @click="onRightBtnClick">
        <slot name="right"/>
      </Button>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { computed, useSlots, useTemplateRef } from 'vue'
import Button from './Button.vue'

const props = defineProps<{
  name?: string,
  rounded?: boolean,
  label?: string,
  type: 'textarea' | 'text' | 'file'
}>()

const text = defineModel<string | undefined>('text')
const emit = defineEmits(['right-btn-click'])

const element = useTemplateRef<HTMLElement>('element')
const slots = useSlots()

const tag = computed(() => props.type == 'textarea' ? 'textarea' : 'input')


function onInput(event: {target: {value: string}}) {
  text.value = event.target.value
}

function onRightBtnClick() {
  emit('right-btn-click')
}

defineExpose({element})
</script>
