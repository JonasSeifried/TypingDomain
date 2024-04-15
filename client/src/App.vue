<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { socket, bindEvents } from './socket'
import { useAuthStore } from './stores/auth'
import { useSocketStore } from './stores/socket'
import { useRouter } from 'vue-router'
import { HomeRoute } from './router'

const authStore = useAuthStore()
const connectionStore = useSocketStore()
const router = useRouter()

onBeforeMount(() => {
    socket.off()
    bindEvents()
    connectionStore.connect()
})
</script>

<template>
    <header class="grid w-full grid-cols-3 justify-evenly">
        <button
            v-if="authStore.isSignedIn"
            class="p-4 text-xl hover:text-white w-fit hover:scale-110"
            @click="authStore.signOut"
        >
            Sign Out
        </button>
        <a
            href="#"
            class="col-start-2 m-4 text-2xl text-center text-white"
            @click="router.push(HomeRoute)"
        >
            Typing Domain
        </a>
        <span class="m-4 text-xl text-right">{{ authStore.username }}</span>
    </header>
    <main class="flex justify-center w-full h-full">
        <div class="container flex flex-col items-center h-full">
            <RouterView />
        </div>
    </main>
</template>
