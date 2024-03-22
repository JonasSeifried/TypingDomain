<script setup lang="ts">
import { useRoomStore } from '@/stores/room'
import { computed } from 'vue'

const roomStore = useRoomStore()

const waitingFor = computed(() => {
    const notReady = roomStore.clientsInRoom.filter((client) => !client.isReady)
    const readyCount = notReady.length
    if (!roomStore.isReady && roomStore.clientsInRoom.length - readyCount == 1)
        return 'Ready up! <span class="text-pink-700">Everyone</span> is waiting for you!'
    if (!roomStore.isReady) return 'Ready up!'
    const notReadyText = notReady
        .reduce((acc, client) => acc + client.username + ', ', '')
        .slice(0, -2)
    return `Waiting for ${notReadyText}`
})
</script>

<template>
    <div class="flex flex-col w-1/2 p-4 m-4">
        <div class="flex justify-between">
            <span class="mx-3">Player</span>
            <span v-html="waitingFor"></span>
            <button class="mx-3" @click="roomStore.toggleReady">
                {{ roomStore.isReady ? 'Cancel' : 'Ready' }}
            </button>
        </div>
        <hr class="border-t-4 rounded my-2" />
        <div
            v-for="client in roomStore.clientsInRoom"
            :key="client.socketId"
            class="flex justify-between w-full"
        >
            <div class="relative w-2/3">
                <span class="text-2xl max-w-full inline-block truncate peer">{{
                    client.username
                }}</span>
                <div
                    class="invisible peer-hover:visible absolute bottom-full left-1/2 ml-[-50%] p-2 bg-zinc-800 rounded-xl flex justify-center items-center"
                >
                    <span class="px-2 text-2xl z-50">{{ client.username }}</span>
                </div>
            </div>

            <i
                :class="[
                    'nf text-2xl',
                    client.isReady ? 'nf-oct-check text-green-800' : 'nf-oct-x text-pink-700'
                ]"
            ></i>
        </div>
    </div>
</template>
