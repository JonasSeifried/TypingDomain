<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useRoomStore } from '@/stores/room'
import FreeForAllGame from './FreeForAllGame.vue'
import FreeForAllPreGame from './FreeForAllPreGame.vue'

const route = useRoute()
const roomStore = useRoomStore()
var roomId = route.params.roomId as string

onBeforeMount(() => {
    if (roomStore.isInRoom()) return
    roomStore.joinRoom(roomId, (err) => {
        if (!err.success) {
            console.error(err.error.message)
        }
    })
})
</script>

<template>
    <div class="flex flex-col items-center mx-10 w-full h-full">
        <h1 class="mb-5 text-2xl text-white">Typing Domain</h1>
        <FreeForAllPreGame v-if="roomStore.isWaiting" />
        <FreeForAllGame v-if="roomStore.isPlaying" />
        <FreeForAllPostGame v-if="roomStore.isFinished" />
    </div>
</template>
