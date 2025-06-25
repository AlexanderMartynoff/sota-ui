<template>
  <div class="x-layout size-full  size-full grid" :class="classes" :data-name="name" :data-view="view">
    <slot/>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref } from 'vue'
import type { PropType, ComputedRef } from 'vue'

const sidebar = ref(true)

const props = defineProps({
  // s - sidebar
  // h - header
  // c - content
  // f - footer

  name: {
    type: String,
    default: 'layout',
  },

  view: {
    type: String as PropType<'shh-scc-sff' | 'hhh-ccc' | 'hhh-ccc-fff'>,
    required: true,
  },

  size: {
    type: Object as PropType<{s: {sm: string, md: string, lg: string, xl: string}}>,
    default: {
      s: {
        xs3: '0',
        xs2: '0',
        xs: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        xl2: '280px',
        xl3: '300px',
        xl4: '330px',
        xl5: '380px',
        xl6: '400px',
        xl7: '500px',
      }
    },
  }
})


const size = computed(() => {
  return {
    s: sidebar.value ? props.size.s : {
        xs3: '0',
        xs2: '0',
        xs: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        xl2: '0',
        xl3: '0',
        xl4: '0',
        xl5: '0',
        xl6: '0',
        xl7: '0',
    }
  }
})

const views: ComputedRef<{
  [key in 'shh-scc-sff' | 'hhh-ccc' | 'hhh-ccc-fff']: string[]
}> = computed(() => ({
  'shh-scc-sff': [
    'grid-rows-[max-content_1fr_max-content]',
    'grid-cols-[0_1fr]',
    `@3x1:grid-cols-[var(--sidebar-3xs-width)_1fr]`,
    `@2xs:grid-cols-[var(--sidebar-2xs-width)_1fr]`,
    `@xs:grid-cols-[var(--sidebar-xs-width)_1fr]`,
    `@sm:grid-cols-[var(--sidebar-sm-width)_1fr]`,
    `@md:grid-cols-[var(--sidebar-md-width)_1fr]`,
    `@lg:grid-cols-[var(--sidebar-lg-width)_1fr]`,
    `@xl:grid-cols-[var(--sidebar-xl-width)_1fr]`,
    `@2xl:grid-cols-[var(--sidebar-2xl-width)_1fr]`,
    `@3xl:grid-cols-[var(--sidebar-3xl-width)_1fr]`,
    `@4xl:grid-cols-[var(--sidebar-4xl-width)_1fr]`,
    `@5xl:grid-cols-[var(--sidebar-5xl-width)_1fr]`,
    `@6xl:grid-cols-[var(--sidebar-6xl-width)_1fr]`,
    `@7xl:grid-cols-[var(--sidebar-7xl-width)_1fr]`,
  ],
  'hhh-ccc': ['grid-rows-[max-content_1fr]', 'grid-cols-1'],
  'hhh-ccc-fff': ['grid-rows-[max-content_1fr_max-content]', 'grid-cols-1'],
}))

const classes = computed(() => views.value[props.view])

provide('layout', {
  onSidebarVisibilityChange(visible: boolean) {
    sidebar.value = visible
  }
})

provide('view', computed(() => props.view))
</script>


<style lang="css" scoped>
.x-layout {
  --sidebar-3xs-width: v-bind(size.s.xs3);
  --sidebar-2xs-width: v-bind(size.s.xs2);
  --sidebar-xs-width: v-bind(size.s.xs);
  --sidebar-sm-width: v-bind(size.s.sm);
  --sidebar-md-width: v-bind(size.s.md);
  --sidebar-lg-width: v-bind(size.s.lg);
  --sidebar-xl-width: v-bind(size.s.xl);
  --sidebar-2xl-width: v-bind(size.s.xl2);
  --sidebar-3xl-width: v-bind(size.s.xl3);
  --sidebar-4xl-width: v-bind(size.s.xl4);
  --sidebar-5xl-width: v-bind(size.s.xl5);
  --sidebar-6xl-width: v-bind(size.s.xl6);
  --sidebar-7xl-width: v-bind(size.s.xl7);
}
</style>
