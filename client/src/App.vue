<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { initializeFirebase } from './firebase/firebase'
import { socket, bindEvents } from './socket'
import { useAuthStore } from './stores/auth'
import { useConnectionStore } from './stores/connection'

const authStore = useAuthStore()
const connectionStore = useConnectionStore()

onBeforeMount(() => {
    socket.off()
    bindEvents()
    connectionStore.connect()

    initializeFirebase()
})
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
./firebase/firebase
