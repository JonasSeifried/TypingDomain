<script setup lang="ts">
import { FreeFforAllLobbyRoute } from '@/router'
import { useRouter } from 'vue-router'

const router = useRouter()

function onSubmit() {
    router.push(FreeFforAllLobbyRoute)
}
</script>

<template>
    <h1 class="text-6xl m-8">Typing Domain</h1>
    <div class="flex flex-col w-1/2 h-64 bg-zinc-800 rounded-lg items-center">
        <h2 class="text-2xl m-4">Classic</h2>
        <button class="room-button" @click="onSubmit">Play</button>
    </div>
</template>
