<script setup lang="ts">
import { FreeForAllLobbyRoute } from "@/router";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <span
    >by
    <a href="https://jonasseifried.com/" target="_blank" rel="noopener noreferrer" class="text-primary"
      >Jonas Seifried</a
    ></span
  >
  <div class="flex flex-col items-center w-1/2 h-64 mt-16 rounded-lg bg-secondary/25">
    <h2 class="m-4 text-2xl text-accent-50">Classic</h2>
    <button
      class="p-3 px-8 transition-all rounded bg-primary text-secondary hover:scale-105 hover:translate-y-1 hover:shadow hover:shadow-primary"
      @click="router.push(FreeForAllLobbyRoute)"
    >
      Play
    </button>
  </div>
</template>
