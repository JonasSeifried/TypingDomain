<script setup lang="ts">
import HomePage from './components/HomePage.vue'
import TheMain from './components/TheMain.vue'
import { state } from './socket'
</script>

<template>
  <main class="flex flex-col items-center mx-10">
    <TheMain v-if="state.joinedRoom !== null" />
    <HomePage v-else-if="state.connected" />
  </main>
</template>
