<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { socket, state } from '@/socket'
import ModalTemplate from './ModalTemplate.vue'

const hiddenInputField = ref<HTMLInputElement | null>(null)
const typedText = ref<string>('')
const playerName = ref<string>('')
const route = useRoute()
var roomId = route.params.roomId as string
var lastInputEmited: string | null = null

function onInput() {
  if (lastInputEmited === typedText.value) return
  socket.emit('textFieldInput', typedText.value)
  lastInputEmited = typedText.value
}

function onDivClick() {
  if (!hiddenInputField.value) return
  if (!state.joinedRoom) return
  hiddenInputField.value.focus()
}

function letterClass(letter: string, index: number): string {
  if (typedText.value.length <= index) return 'white_letter'
  return letter === typedText.value[index] ? 'green_letter' : 'red_letter'
}

function joinRoom() {
  if (playerName.value === '') return
  socket.emit('joinRoom', roomId, playerName.value, (err) => {
    if (err) {
      console.error(err)
      return
    }
    state.joinedRoom = roomId
  })
}
</script>

<template>
  <div class="flex flex-col items-center mx-10" :onClick="onDivClick">
    <h1 class="m-5 text-2xl text-white">Typing Domain</h1>
    <div v-if="state.joinedRoom" id="slider-div" class="flex flex-col w-1/2">
      <div v-for="client in state.clientsInRoom" :key="client.socketId" class="m-2">
        <label :for="client.socketId + '-slider'" class="mr-4">{{
          client.playerName + (client.socketId === socket.id ? ' (You)' : '')
        }}</label>
        <progress
          class="w-full h-4 rounded-lg dark:bg-gray-700"
          :id="client.socketId + '-slider'"
          type="range"
          :max="state.activeText?.length ?? 1"
          :value="client.typedText.length"
        >
          {{ state.activeText ? client.typedText.length / state.activeText?.length : 0 }}%
        </progress>
      </div>
    </div>
    <ModalTemplate v-else modalClass="w-1/4 h-1/4">
      <template v-slot:header>
        <h2 class="text-2xl mb-2">Enter a Name</h2>
      </template>
      <template v-slot:body>
        <p></p>
        <input
          @keydown.enter="joinRoom"
          class="p-2 rounded text-black m-1"
          type="text"
          placeholder="The typing menace"
          v-model="playerName"
        />
      </template>
      <template v-slot:footer>
        <button class="room-button" @click="joinRoom" :disabled="playerName.trim() === ''">
          Join Room
        </button>
      </template>
    </ModalTemplate>

    <div class="flex flex-wrap w-1/2 gap-y-1">
      <span
        v-for="(item, index) in state.activeText"
        :key="index"
        class="letter text-xl rounded-[0.25rem] border-[1px] border-white border-opacity-5 whitespace-pre"
        :class="letterClass(item, index)"
      >
        {{ item }}
      </span>
    </div>
    <input
      ref="hiddenInputField"
      v-model="typedText"
      @input="onInput"
      class="hidden-input-field"
      autofocus
    />
  </div>
</template>

<style scoped>
.letter {
  font-family: Hack, monospace;
}
.green_letter {
  color: rgb(30, 153, 30);
  background: rgba(30, 153, 30, 0.15);
}
.red_letter {
  color: rgb(170, 26, 26);
  background: rgba(170, 26, 26, 0.15);
}
.hidden-input-field {
  position: absolute;
  opacity: 0;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}
</style>
