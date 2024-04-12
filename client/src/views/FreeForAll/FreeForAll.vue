<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useRoomStore } from '@/stores/room'
import FreeForAllInGame from './FreeForAllInGame.vue'
import FreeForAllPreGame from './FreeForAllPreGame.vue'
import FreeForAllPostGame from './FreeForAllPostGame.vue'

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
    <div class="flex flex-col items-center w-full h-full mx-10">
        <h1 class="mb-5 text-2xl text-white">Typing Domain</h1>
        <span v-if="!roomStore.isPreGame" class="relative right-0 ml-20">{{
            roomStore.gameTimer
        }}</span>
        <FreeForAllPreGame v-if="roomStore.isPreGame" />
        <FreeForAllInGame v-if="roomStore.isInGame" />
        <FreeForAllPostGame v-if="roomStore.isPostGame" />
    </div>
</template>
