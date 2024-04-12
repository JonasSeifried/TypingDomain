<script setup lang="ts">
import { useRoomStore } from '@/stores/room'

const roomStore = useRoomStore()
</script>

<template>
    <div class="container bg-pink-300">
        //TODO: Make analytics
        <div v-for="clientData in roomStore.clientsInRoom" :key="clientData.socketId">
            <span>{{ clientData.username }}</span>
        </div>
    </div>
</template>
