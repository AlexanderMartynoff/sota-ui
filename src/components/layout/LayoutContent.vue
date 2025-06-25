<template>
  <div class="x-layout__content overflow-y-auto" :class="[classes, {'p-1': paddings}]" :data-view="view" ref="element">
    <slot/>
  </div>
</template>


<script lang="ts" setup>
import { inject, computed, useSlots, useTemplateRef } from 'vue'
import type { ComputedRef } from 'vue'

defineProps<{paddings?: boolean}>()

const slots = useSlots()
const element = useTemplateRef('element')

const view = inject<ComputedRef<'shh-scc-sff' | 'hhh-ccc'>>('view')

const views: {
  [key in 'shh-scc-sff' | 'hhh-ccc']: string[]
} = {
  'shh-scc-sff': ['row-start-2', 'row-end-3', 'col-start-2', 'col-end-3'],
  'hhh-ccc': ['row-start-2', 'row-end-3', 'col-start-1', 'col-end-2'],
}

const classes = computed(() => view?.value ? views[view.value] : [])

defineExpose({element})
</script>
