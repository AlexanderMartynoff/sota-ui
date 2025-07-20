<template>
  <Modal ref="modal" mode="content-center">
    <div class="x-dialog w-full h-full border rounded bg-white md:h-120 md:w-120 max-h-full border-gray-300 overflow-hidden" ref="dialog">
      <Layout view="hhh-ccc-fff">
        <LayoutContent>
          <slot/>
        </LayoutContent>
        <LayoutFooter>
          <slot name="footer"/>
        </LayoutFooter>
      </Layout>
    </div>
  </Modal>
</template>


<script setup lang="ts">
import { useTemplateRef, onUnmounted, nextTick } from 'vue'
import Modal from './Modal.vue'
import Layout from '../layout/Layout.vue'
import LayoutContent from '../layout/LayoutContent.vue'
import LayoutFooter from '../layout/LayoutFooter.vue'

const emits = defineEmits(['resize'])

const modal = useTemplateRef('modal')
const dialog = useTemplateRef('dialog')

const observer = new ResizeObserver(entries => {
  emits('resize')
})

function open() {
  modal.value?.open()

  nextTick(() => {
    if (dialog.value == null) {
      return
    }

    observer.observe(dialog.value)
  })
}

function close() {
  modal.value?.close()
}

onUnmounted(() => {
  observer.disconnect()
})

defineExpose({
  open,
  close,
})
</script>
