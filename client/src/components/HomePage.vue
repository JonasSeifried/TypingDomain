<script setup lang="ts">
import { socket, state } from '@/socket'
import { onMounted, ref } from 'vue'

const validatingError = ref('')
const roomId = ref('')
const playerName = ref('')

function joinRoom() {
  if (!validate()) return
  socket.emit('joinRoom', roomId.value, playerName.value, (err) => {
    if (err) {
      validatingError.value = err
      return
    }
    state.joinedRoom = roomId.value
    console.log('Joined room:', roomId.value)
  })
}

function validate() {
  if (roomId.value === '') {
    validatingError.value = 'Room id cannot be empty'
    return false
  }
  return true
}
onMounted(() => {
  console.log('Socket id:', socket.id)
  roomId.value = socket.id!
})
</script>

<template>
  <h1 class="text-6xl m-8">Typing Domain</h1>
  <div class="flex flex-col w-1/2 h-96 bg-zinc-800 rounded-lg items-center">
    <h2 class="text-2xl m-4">Join or Create a Room</h2>
    <div class="flex">
      <div class="flex flex-col m-2">
        <label for="playerName">Optional Player Name</label>
        <input
          id="playerName"
          class="p-2 rounded-md text-black"
          type="text"
          placeholder="The typing menace"
          v-model="playerName"
        />
      </div>
      <div class="flex flex-col m-2">
        <label for="roomId">Room Id</label>
        <input id="roomId" class="p-2 rounded-md text-black" type="text" v-model="roomId" />
      </div>
    </div>

    <p id="error-text" :hidden="!validatingError" class="text-red-500">{{ validatingError }}</p>
    <button class="room-button" @click="joinRoom" :disabled="roomId === ''">Join Room</button>
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
