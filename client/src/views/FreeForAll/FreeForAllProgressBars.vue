<script setup lang="ts">
import { socket } from '@/socket'
import { useRoomStore } from '@/stores/room'

const roomStore = useRoomStore()

function buildUsername(username: string, socketId: string): string {
    if (socketId === socket.id) return username + ' (You)'
    return username
}

function progressValue(typedText: string) {
    if (!roomStore.textOfRoom) return 0
    return typedText.length / roomStore.textOfRoom.length
}
</script>

<template>
    <div id="slider-div" class="flex flex-col w-1/2">
        <div v-for="client in roomStore.clientsInRoom" :key="client.socketId" class="m-2">
            <label :for="client.socketId" class="mr-4">{{
                buildUsername(client.username, client.socketId)
            }}</label>
            <progress
                class="w-full h-4 rounded-lg dark:bg-gray-700"
                :id="client.socketId"
                type="range"
                :max="roomStore.textOfRoom.length"
                :value="client.typedText.length"
            >
                {{ progressValue(client.typedText) }}%
            </progress>
        </div>
    </div>
</template>
