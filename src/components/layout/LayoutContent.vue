<template>
  <div class="x-layout__content relative overflow-auto" :class="[classes, {'border-y-1': bordered == 'lr', 'border': bordered == 'ltrb'}]" :data-view="view">
    <div class="x-layout__content__scroll-area overflow-auto absolute size-full @container" :class="{'p-2': padding}" ref="element">
      <slot/>
    </div>
    <slot name="sticky"/>
  </div>
</template>


<script lang="ts" setup>
import { inject, computed, useTemplateRef } from 'vue'
import type { ComputedRef } from 'vue'

defineProps<{padding?: boolean, bordered?: 'ltrb' | 'lr'}>()

const element = useTemplateRef('element')

const view = inject<ComputedRef<'shh-scc-sff' | 'hhh-ccc' | 'hhh-ccc-fff'>>('view')

const views: {
  [key in 'shh-scc-sff' | 'hhh-ccc' | 'hhh-ccc-fff' | 'ccc']: string[]
} = {
  'shh-scc-sff': ['row-start-2', 'row-end-3', 'col-start-2', 'col-end-3'],
  'hhh-ccc': ['row-start-2', 'row-end-3', 'col-start-1', 'col-end-2'],
  'hhh-ccc-fff': ['row-start-2', 'row-end-3', 'col-start-1', 'col-end-2'],
  'ccc': ['row-start-1', 'row-end-2', 'col-start-1', 'col-end-2'],
}

const classes = computed(() => view?.value ? views[view.value] : [])

defineExpose({element})
</script>
