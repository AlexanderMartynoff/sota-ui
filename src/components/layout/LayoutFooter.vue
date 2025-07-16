<template>
  <div class="x-layout__footer overflow-auto border-gray-200 relative" :class="[classes, {'border-t-1': bordered == 't', 'border border-t-0': bordered == 'lrb'}]" :data-view="view" v-if="slots.default">
    <slot/>
  </div>
</template>


<script lang="ts" setup>
import { inject, computed, useSlots } from 'vue'
import type { ComputedRef } from 'vue'

defineProps<{bordered?: 'lrb' | 't'}>()

const slots = useSlots()
const view = inject<ComputedRef<'shh-scc-sff' | 'hhh-ccc' | 'hhh-ccc-fff'>>('view')

const views: {
  [key in 'shh-scc-sff' | 'hhh-ccc' | 'hhh-ccc-fff']: string[]
} = {
  'shh-scc-sff': ['row-start-3', 'row-end-4', 'col-start-2', 'col-end-3'],
  'hhh-ccc': ['row-start-3', 'row-end-4', 'col-start-1', 'col-end-3'],
  'hhh-ccc-fff': ['row-start-3', 'row-end-4', 'col-start-1', 'col-end-3'],
}

const classes = computed(() => view?.value ? views[view.value] : [])
</script>
