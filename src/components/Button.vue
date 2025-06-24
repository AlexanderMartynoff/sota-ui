<template>
  <button type="button" class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset cursor-pointer" @click="onClick">
    <slot/>
  </button>
</template>


<script lang="ts" setup>
const emit = defineEmits(['click'])

function onClick() {
  emit('click')
}
</script>
