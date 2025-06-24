<template>
  <div class="x-layout--sidebar" :class="['hidden', {'border-r-1 border-r-gray-200 sm:block': visible}, classes]">
    <slot/>
  </div>
</template>


<script lang="ts" setup>
import { inject, computed } from 'vue'
import type { ComputedRef } from 'vue'


const props = defineProps<{side: 'left', visible?: boolean}>()

const classes = inject<ComputedRef<string[]>>(`layout/sidebar-${props.side}/classes`)

if (classes == undefined) {
  throw new Error('Component "LayoutSidebar" must be use only as "Layout" child')
}
</script>
