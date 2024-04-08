<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { socket, bindEvents } from './socket'
import { useAuthStore } from './stores/auth'
import { useSocketStore } from './stores/socket'

const authStore = useAuthStore()
const connectionStore = useSocketStore()

onBeforeMount(() => {
    socket.off()
    bindEvents()
    connectionStore.connect()
})
</script>

<template>
    <header class="flex justify-between">
        <button
            v-if="authStore.isSignedIn"
            class="text-xl m-4 hover:text-white hover:scale-110"
            @click="authStore.signOut"
        >
            Logout
        </button>
        <span class="text-xl m-4">{{ authStore.username }}</span>
    </header>
    <main class="flex flex-col items-center mx-10 grow">
        <RouterView />
    </main>
</template>
