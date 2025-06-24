<template>
  <div class="x-layout--footer border-t-1 border-t-gray-200" :class="classes">
    <slot/>
  </div>
</template>


<script lang="ts" setup>
import { inject } from 'vue'
import type { ComputedRef } from 'vue'


const classes = inject<ComputedRef<string[]>>('layout/footer/classes')

if (classes == undefined) {
  throw new Error('Component "LayoutFooter" must be use only as "Layout" child')
}
</script>
