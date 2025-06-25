<template>
  <div class="x-layout__footer overflow-y-auto border-t-gray-200 relative" :class="[classes, {'border-t-1': bordered}]" :data-view="view" v-if="slots.default">
    <slot/>
  </div>
</template>


<script lang="ts" setup>
import { inject, computed, useSlots } from 'vue'
import type { ComputedRef } from 'vue'

defineProps<{bordered?: boolean}>()

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
