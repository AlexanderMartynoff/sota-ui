<template>
  <Dialog ref="dialog" @resize="onResize">
    <div class="x-cropper absolute size-full overflow-hidden"/>
    <template #footer>
      <Toolbar class="px-1">
        <span class="flex-1">
          <Button @click="onCloseBtnClick">
            <ChevronLeftIcon class="size-5 text-black"/>
          </Button>
        </span>
        <span class="flex-auto flex items-center justify-center">
          <Button class="flex" @click="onClickSave">
            <ViewfinderCircleIcon class="size-10 text-green-500"/>
          </Button>
        </span>
        <span class="flex-1"></span>
      </Toolbar>
    </template>
  </Dialog>
</template>


<script setup lang="ts">
import { useTemplateRef, nextTick, onMounted } from 'vue'
import { useCropper } from '../library/cropper'
import { ViewfinderCircleIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'
import Toolbar from './Toolbar.vue'
import Button from './Button.vue'
import Dialog from './modal/Dialog.vue'

const template = `
<cropper-canvas class="size-full">
  <cropper-image scalable translatable></cropper-image>
  <cropper-shade></cropper-shade>
  <cropper-handle action="move" plain></cropper-handle>
  <cropper-selection aspect-ratio="1" initial-coverage=".6">
    <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
  </cropper-selection>
</cropper-canvas>
`

const { load, save, refresh } = useCropper({
  container: '.x-cropper',
  template,
})

const emits = defineEmits(['crop', 'hide'])
const props = defineProps<{file?: File}>()

const dialog = useTemplateRef('dialog')

const type = 'image/webp'

function onResize(size: {width: number, height: number}) {
  refresh()
}

function onShow() {
  if (props.file == undefined) {
    return
  }

  load(props.file).then(() => {
    refresh()
  })
}

function onHide() {
  emits('hide')
}

function onClickSave() {
  save(80, 80).then(canvas => {
    canvas.toBlob((blob) => {
      if (blob == null) {
        throw new Error()
      }

      emits('crop', new File([blob], props.file?.name || 'undefined', {type}))
    }, type)
  })
}

function open() {
  dialog.value?.open()

  nextTick().then(() => {
    onShow()
  })
}

function close() {
  dialog.value?.close()
}

function onCloseBtnClick() {
  dialog.value?.close()
}

defineExpose({
  open,
  close,
})
</script>
