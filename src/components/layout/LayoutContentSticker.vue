<template>
  <div class="cursor-pointer absolute rounded-full w-[60px] h-[60px] bottom-[10px] right-[20px] shadow-md bg-blue-500 hover:bg-blue-600 flex justify-center items-center z-50">
    <ChevronDownIcon class="text-white size-5"/>
  </div>
</template>


<script lang="ts" setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
</script>