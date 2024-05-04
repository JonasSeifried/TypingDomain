<script setup lang="ts">
import { socket } from "@/socket";
import { useRoomStore } from "@/stores/room";

const roomStore = useRoomStore();

function buildUsername(username: string, socketId: string): string {
  if (socketId === socket.id) return username + " (You)";
  return username;
}

function progressValue(typedText: string) {
  if (!roomStore.textOfRoom) return 0;
  return (typedText.length / roomStore.textOfRoom.length) * 100;
}
</script>

<template>
  <div id="slider-div" class="flex flex-col w-1/2">
    <div v-for="client in roomStore.clientsInRoom" :key="client.socketId" class="m-2">
      <label :for="client.socketId" class="mr-4">{{ buildUsername(client.username, client.socketId) }}</label>
      <div class="w-full rounded-full bg-secondary" :id="client.socketId">
        <div
          class="bg-accent p-0.5 leading-none rounded-full h-4"
          :class="[client.typedText.length === 0 ? 'invisible' : 'visible']"
          :style="{
            width: `${progressValue(client.typedText)}%`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>
@/services/room
