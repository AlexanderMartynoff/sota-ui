<template>
  <button type="button" class="h-13 p-1 rounded flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer" :class="[{'mx-2': toolbar, 'border border-gray-400 bg-gray-200': bordered}]" @click="onClick">
    <slot/>
  </button>
</template>


<script lang="ts" setup>
defineProps<{toolbar?: boolean, bordered?: boolean}>()

const emit = defineEmits(['click'])

function onClick() {
  emit('click')
}

</script>
