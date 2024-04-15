<script setup lang="ts">
import { FreeForAllLobbyRoute } from '@/router'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <div class="flex flex-col items-center w-1/2 h-64 mt-16 rounded-lg bg-zinc-800">
        <h2 class="m-4 text-2xl">Classic</h2>
        <button class="room-button" @click="router.push(FreeForAllLobbyRoute)">Play</button>
    </div>
</template>
