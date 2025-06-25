<template>

</template>


<script lang="ts" setup>
import { useSlots } from 'vue'
import Button from './Button.vue'
import { PaperClipIcon, UserCircleIcon, UsersIcon, CloudArrowUpIcon } from '@heroicons/vue/24/solid'

defineProps<{name?: string, rounded?: boolean, label?: string}>()

const slots = useSlots()
</script>
