<template>
  <div class="x-layout--content overflow-y-auto" :class="classes">
    <slot/>
  </div>
</template>


<script lang="ts" setup>
import { inject } from 'vue'
import type { ComputedRef } from 'vue'


const classes = inject<ComputedRef<string[]>>('layout/content/classes')

if (classes == undefined) {
  throw new Error('Component "LayoutContent" must be use only as "Layout" child')
}
</script>
