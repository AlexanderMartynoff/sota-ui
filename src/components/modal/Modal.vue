<template>
  <teleport to="body">
    <div class="x-modal p-3 absolute top-0 bottom-0 left-0 right-0 bg-white/70 z-1000" :class="classes" v-if="mode == 'opened'">
      <slot/>
    </div>
  </teleport>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ref } from 'vue'

const props = defineProps<{mode?: 'content-center'}>()

const mode: Ref<'closed' | 'opened'> = ref('closed')

function open() {
  mode.value = 'opened'
}

function close() {
  mode.value = 'closed'
}

const classes = computed(() => {
  return {
    'flex items-center justify-center': props.mode == 'content-center'
  }
})

defineExpose({
  open,
  close,
})
</script>
