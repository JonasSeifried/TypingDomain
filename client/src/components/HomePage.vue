<script setup lang="ts">
import { socket } from '@/socket.ts'
import { ref } from 'vue'

const validatingError = ref('test')
const roomName = ref('')

function joinRoom() {
  console.log(socket)
  if (!vailidateRoomName(roomName.value)) return
  socket.emit('join-room', roomName.value, (err) => {
    if (err) {
      validatingError.value = err
      return
    }
    console.log('Joined room:', roomName.value)
  })
}

function vailidateRoomName(roomName: string) {
  if (roomName === '') {
    validatingError.value = 'Room name cannot be empty'
    return false
  }
  return true
}
</script>

<template>
  <h1 class="text-6xl m-8">Typing Domain</h1>
  <div class="flex flex-col w-1/2 h-96 bg-zinc-800 rounded-lg items-center">
    <h2 class="text-2xl m-4">Join or Create a Room</h2>
    <p id="error-text" :hidden="!validatingError">{{ validatingError }}</p>
    <input
      class="w-1/2 p-2 m-2 rounded-lg text-black"
      type="text"
      placeholder="Room Name"
      v-model="roomName"
    />
    <button class="room-button" @click="joinRoom" :disabled="roomName === ''">Join Room</button>
  </div>
</template>

<style scoped>
.room-button {
  width: 10rem;
  padding: 0.5rem;
  margin: 0.25rem;
  background-color: white;
  border: 3px solid lightgreen;
  border-radius: 0.25rem;
  color: black;
}
.room-button:hover:not(:disabled) {
  border-color: white;
  background-color: lightgreen;
  scale: 1.05;
}
.room-button:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}
</style>
