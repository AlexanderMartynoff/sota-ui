<template>
  <div class="flex items-center">
    <slot/>
  </div>
</template>


<script lang="ts" setup>
defineProps<{toolbar?: boolean}>()
</script>
