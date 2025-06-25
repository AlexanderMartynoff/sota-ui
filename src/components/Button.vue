<template>
  <button type="button" class="h-13 flex items-center justify-center text-gray-400 hover:text-gray-800 cursor-pointer" :class="[{'mx-3': toolbar}]" @click="onClick">
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
