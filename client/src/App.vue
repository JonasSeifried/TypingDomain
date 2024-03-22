<script setup lang="ts">
import { socket, bindEvents } from './socket'
import { useAuthStore } from './stores/auth'
import { useConnectionStore } from './stores/connection'

socket.off()
const connectionStore = useConnectionStore()
bindEvents()
connectionStore.connect()

const authStore = useAuthStore()
</script>

<template>
    <header>
        <button
            v-if="authStore.isAuthorized"
            class="absolute right-0 m-4 text-xl hover:text-white hover:scale-110"
            @click="authStore.logout"
        >
            Logout
        </button>
    </header>
    <main v-if="connectionStore.isConnected" class="flex flex-col items-center mx-10">
        <RouterView />
    </main>
</template>
