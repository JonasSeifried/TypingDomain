<script setup lang="ts">
import { onBeforeMount, ref, type VNodeRef } from 'vue'
import { useRoute } from 'vue-router'
import { useRoomStore } from '@/stores/room'
import FreeForAllPreGame from './FreeForAllPreGame.vue'
import FreeForAllGame from './FreeForAllGame.vue'

const writableDiv = ref<HTMLDivElement | null>(null)
const route = useRoute()
const roomStore = useRoomStore()
var roomId = route.params.roomId as string



function onDivClick() {
    console.log('clicked', writableDiv.value)
    if (!writableDiv.value) return
    writableDiv.value.focus()
}


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
        <div :onClick="onDivClick" class="p-8 bg-stone-700 w-3/5 rounded flex flex-row focus-within:outline text-xl">
            <div class="flex w-48">

                <div class="bg-stone-600 p-4 flex-grow"></div>
                <div ref="writableDiv" class="w-max text-nowrap max-w-48 whitespace-pre overflow-hidden focus:outline-none" contenteditable="true"></div>
            </div>
            <div class="bg-stone-800 w-48 p-4"></div>
            <!-- <wbr> -->
        </div>
        <!-- <FreeForAllPreGame v-if="roomStore.isWaiting" />
        <FreeForAllGame v-if="roomStore.isPlaying" /> -->
        <!-- <FreeForAllPostGame v-if="roomStore.isFinished" />   -->
    </div>
</template>


