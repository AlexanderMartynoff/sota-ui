<template>
  <div class="x-layout--header border-b-1 border-b-gray-200" :class="classes">
    <slot/>
  </div>
</template>


<script lang="ts" setup>
import { inject } from 'vue'
import type { ComputedRef } from 'vue'


const classes = inject<ComputedRef<string[]>>('layout/header/classes')

if (classes == undefined) {
  throw new Error('Component "" must be use only as "Layout" child')
}
</script>
