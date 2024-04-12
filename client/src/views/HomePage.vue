<script setup lang="ts">
import { FreeFforAllLobbyRoute } from '@/router'
import { useRouter } from 'vue-router'

const router = useRouter()

function onSubmit() {
    router.push(FreeFforAllLobbyRoute)
}
</script>

<template>
    <h1 class="m-8 text-6xl">Typing Domain</h1>
    <div class="flex flex-col items-center w-1/2 h-64 rounded-lg bg-zinc-800">
        <h2 class="m-4 text-2xl">Classic</h2>
        <button class="room-button" @click="onSubmit">Play</button>
    </div>
</template>
