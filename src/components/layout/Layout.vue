<template>
  <div class="x-layout h-full grid" :class="classes">
    <slot/>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'

const props = defineProps<{view: 'shh scc sff' | 'hhh scc fff' | 'hhh ccc'}>()


const views: {
  [key in 'shh scc sff' | 'hhh scc fff' | 'hhh ccc']: {
    [key in 'layout' | 'header' | 'content' | 'footer' | 'sidebar-left']?: string[]
  }
} = {
  'hhh scc fff': {
    'layout': ['grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr]'],
    'header': ['row-start-1 row-end-2 col-start-1 col-end-3'],
    'content': ['row-start-2 row-end-3 col-start-2 col-end-3'],
    'footer': ['row-start-3 row-end-4 col-start-1 col-end-3'],
    'sidebar-left': ['row-start-2 row-end-3 col-start-1 col-end-2'],
  },

  'shh scc sff': {
    'layout': ['grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr]'],
    'header': ['row-start-1 row-end-2 col-start-2 col-end-3'],
    'content': ['row-start-2 row-end-3 col-start-2 col-end-3'],
    'footer': ['row-start-3 row-end-4 col-start-2 col-end-3'],
    'sidebar-left': ['row-start-1 row-end-4 col-start-1 col-end-2'],
  },

  'hhh ccc': {
    'layout': ['grid-rows-[auto_1fr] grid-cols-1'],
    'header': ['row-start-1 row-end-2 col-start-1 col-end-2'],
    'content': ['row-start-2 row-end-3 col-start-1 col-end-2'],
  },
}
const classes = computed(() => views[props.view]['layout'])


provide('layout/header/classes', computed(() => views[props.view]['header']))
provide('layout/footer/classes', computed(() => views[props.view]['footer']))
provide('layout/sidebar-left/classes', computed(() => views[props.view]['sidebar-left']))
provide('layout/content/classes', computed(() => views[props.view]['content']))
</script>
