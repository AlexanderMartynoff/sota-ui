<template>
  <span class="x-avatar relative rounded-xl border border-blue-500 bg-white border-1 flex bg-center bg-no-repeat bg-cover bg-[image:var(--avatar-bg)] flex items-center justify-center" :class="{'size-35 *:size-35': size == 'lg', 'size-12 *:size-12': size == 'xs'}">
    <UserCircleIcon class="text-blue-400" v-if="bg == undefined"/>
    <span class="absolute z-1 border-2 border-white rounded-full bg-green-500 !size-3 -top-1 -right-1"></span>
  </span>
</template>


<script lang="ts" setup>
import { computed } from 'vue'
import { UserCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{file?: File, id?: string | number, size: 'xs' | 'lg'}>()

const bg = computed(() => {
  if (props.file == undefined) {
    return
  }

  try {
    var url = URL.createObjectURL(props.file)
  } catch (error) {
    return
  }

  return `url(${url})`
})
</script>


<style lang="css" scoped>
.x-avatar {
  --avatar-bg: v-bind(bg);
}
</style>
