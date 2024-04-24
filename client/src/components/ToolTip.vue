<script setup lang="ts"></script>

<!-- * Maybe no use if username max length  -->
<template>
  <div class="relative">
    <slot name="content"></slot>
    <slot name="tooltip"></slot>
    <span class="inline-block max-w-full text-2xl truncate peer">test</span>
    <div
      class="invisible peer-hover:visible hover:visible absolute bottom-full left-1/2 ml-[-50%] p-2 bg-zinc-800 rounded-xl flex justify-center items-center"
    >
      <span class="z-50 px-2 text-2xl">test</span>
    </div>
  </div>
</template>
