<template>
  <div class="x-layout__header overflow-y-auto border-b-1 border-b-gray-200 relative" :class="[classes, {'p-1': paddings}]" :data-view="view" v-if="slots.default">
    <slot/>
  </div>
</template>


<script lang="ts" setup>
import { inject, computed, useSlots } from 'vue'
import type { ComputedRef } from 'vue'


defineProps<{paddings?: boolean}>()

const slots = useSlots()

const view = inject<ComputedRef<'shh-scc-sff' | 'hhh-ccc' | 'hhh-ccc-fff'>>('view')

const views: {
  [key in 'shh-scc-sff' | 'hhh-ccc' | 'hhh-ccc-fff']: string[]
} = {
  'shh-scc-sff': ['row-start-1', 'row-end-2', 'col-start-2', 'col-end-3'],
  'hhh-ccc': ['row-start-1', 'row-end-2', 'col-start-1', 'col-end-2'],
  'hhh-ccc-fff': ['row-start-1', 'row-end-2', 'col-start-1', 'col-end-2'],
}

const classes = computed(() => view?.value ? views[view.value] : [])
</script>
