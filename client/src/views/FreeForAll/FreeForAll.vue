<script setup lang="ts">
import { onBeforeMount, onUnmounted } from 'vue'
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
    roomStore.joinRoom(roomId, (res) => {
        if (res.isErr()) {
            // Todo: Error handling
            console.error(res.error.message)
        }
    })
})

onUnmounted(() => roomStore.leaveRoom())
</script>

<template>
    <span v-if="!roomStore.isPreGame" class="self-end text-xl text-right"
        >{{
            roomStore.isInGame ? Math.round(roomStore.playTime / 1000) : roomStore.playTime / 1000
        }}s</span
    >

    <FreeForAllPreGame v-if="roomStore.isPreGame" />
    <FreeForAllInGame v-if="roomStore.isInGame" />
    <FreeForAllPostGame v-if="roomStore.isPostGame" />
</template>
