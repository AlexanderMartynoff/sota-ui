<template>
  <li class="border-b-1 border-b-gray-200 p-2 group">
    <a href="#" class="flex items-center">
      <slot name="avatar"/>
      <span class="ms-3 text-gray-600 group-hover:text-gray900">{{ title }}</span>
    </a>
  </li>
</template>


<script lang="ts" setup>
defineProps<{ title: string }>()
</script>
