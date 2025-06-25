<template>
  <button type="button" class="h-13 p-1 flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer" :class="[{'mx-2': toolbar}]" @click="onClick">
    <slot/>
  </button>
</template>


<script lang="ts" setup>
defineProps<{toolbar?: boolean}>()

const emit = defineEmits(['click'])

function onClick() {
  emit('click')
}
</script>
