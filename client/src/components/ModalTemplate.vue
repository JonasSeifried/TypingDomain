<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  bgBlur?: boolean
  bgClass?: string
  modalClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  bgBlur: true,
  bgClass: '',
  modalClass: ''
})

const buildBgClass = computed(() => {
  let c =
    'flex items-center justify-center fixed z-20 bottom-0 top-0 left-0 right-0 bg-[rgba(0,0,0,0.33)]'
  if (props.bgBlur) c += ' backdrop-blur-sm'
  console.log(c)
  return c
})
</script>

<template>
  <div :class="[buildBgClass, bgClass]">
    <div
      :class="['bg-zinc-800 rounded-md flex flex-col p-2 items-center justify-between', modalClass]"
    >
      <slot name="header"></slot>
      <slot name="body"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
