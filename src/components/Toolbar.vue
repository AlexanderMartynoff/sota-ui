<template>
  <div :class="`px-2 flex h-16 items-center ${mode}`">
    <slot/>
  </div>
</template>


<script lang="ts" setup>
const props = defineProps<{mode?: 'justify-between'}>()
</script>
