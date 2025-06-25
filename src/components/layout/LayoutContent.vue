<template>
  <div class="x-layout__content relative overflow-hidden" :class="[classes]" :data-view="view">
    <div class="x-layout__content__scroll-area absolute size-full @container" :class="{'overflow-auto': scroll == 'auto', 'overflow-scroll': scroll == 'scroll'}" ref="element">
      <slot/>
    </div>
    <slot name="sticky"/>
  </div>
</template>


<script lang="ts" setup>
import { inject, computed, useSlots, useTemplateRef } from 'vue'
import type { ComputedRef } from 'vue'

defineProps<{scroll: 'auto' | 'scroll'}>()

const slots = useSlots()
const element = useTemplateRef('element')

const view = inject<ComputedRef<'shh-scc-sff' | 'hhh-ccc' | 'hhh-ccc-fff'>>('view')

const views: {
  [key in 'shh-scc-sff' | 'hhh-ccc' | 'hhh-ccc-fff']: string[]
} = {
  'shh-scc-sff': ['row-start-2', 'row-end-3', 'col-start-2', 'col-end-3'],
  'hhh-ccc': ['row-start-2', 'row-end-3', 'col-start-1', 'col-end-2'],
  'hhh-ccc-fff': ['row-start-2', 'row-end-3', 'col-start-1', 'col-end-2'],
}

const classes = computed(() => view?.value ? views[view.value] : [])

defineExpose({element})
</script>
