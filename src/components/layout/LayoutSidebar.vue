<template>
  <div class="x-layout__sidebar border-r-1 border-r-gray-200 relative hidden" :class="[{'@2xl:block': visible}, classes]" :data-view="view" v-if="slots.default">
    <slot/>
  </div>
</template>


<script lang="ts" setup>
import { inject, watch, computed, useSlots } from 'vue'
import type { ComputedRef } from 'vue'

const props = defineProps<{side: 'left', visible?: boolean}>()

const view = inject<ComputedRef<'shh-scc-sff'>>('view')
const layout = inject<{onSidebarVisibilityChange: (visibility: boolean) => void, name: string}>('layout')

const slots = useSlots()

const views: {
  [key in 'shh-scc-sff']: string[]
} = {
  'shh-scc-sff': ['row-start-1', 'row-end-4', 'col-start-1', 'col-end-2'],
}

const classes = computed(() => view?.value ? views[view.value] : [])


watch(() => props.visible, (v) => {
  layout?.onSidebarVisibilityChange(v)
})
</script>
