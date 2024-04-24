<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { socket, bindEvents } from "./socket";
import { useAuthStore } from "./stores/auth";
import { useSocketStore } from "./stores/socket";
import { HomeRoute } from "./router";
import ToggleColorScheme from "./components/ToggleColorScheme.vue";

const authStore = useAuthStore();
const connectionStore = useSocketStore();

onBeforeMount(() => {
  socket.off();
  bindEvents();
  connectionStore.connect();
});
</script>

<template>
  <header class="grid justify-between w-full grid-cols-3 px-4 text-xl sm:px-8">
    <button v-if="authStore.isSignedIn" class="w-fit hover:scale-110" @click="authStore.signOut">Sign Out</button>
    <RouterLink :to="HomeRoute" class="col-start-2 m-4 text-2xl text-center"> Typing Domain </RouterLink>
    <div class="flex items-center justify-end h-full gap-4">
      <span class="text-right">{{ authStore.username }}</span>
    </div>
  </header>
  <main class="flex justify-center w-full h-full">
    <div class="container flex flex-col items-center h-full">
      <RouterView />
    </div>
    <ToggleColorScheme class="absolute bottom-0 right-0 m-16 text-4xl transition-all hover:scale-105" />
  </main>
</template>
