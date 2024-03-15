<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { socket, state } from '@/socket'

const hiddenInputField = ref<HTMLInputElement | null>(null)
const typedText = ref<string>('')
var lastInputEmited: string | null = null

function onInput() {
  if (lastInputEmited === typedText.value) return
  socket.emit('textFieldInput', typedText.value)
  lastInputEmited = typedText.value
}

function onWindowClick() {
  if (!hiddenInputField.value) return
  hiddenInputField.value.focus()
}

function letterClass(letter: string, index: number): string {
  if (typedText.value.length <= index) return 'white_letter'
  return letter === typedText.value[index] ? 'green_letter' : 'red_letter'
}

onMounted(() => {
  window.addEventListener('click', onWindowClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', onWindowClick)
})
</script>

<template>
  <h1 class="m-5 text-2xl text-white">Typing Domain</h1>
  <div id="slider-div" class="flex flex-col w-1/2">
    <div v-for="(client, id) in state.clientsInRoom" :key="id" class="m-2">
      <label :for="id + '-slider'" class="mr-4">{{ client.playerName }}</label>
      <progress
        class="w-full h-4 rounded-lg dark:bg-gray-700"
        :id="id + '-slider'"
        type="range"
        :max="state.activeText?.length ?? 1"
        :value="client.typedText.length"
      >
        {{ state.activeText ? client.typedText.length / state.activeText?.length : 0 }}%
      </progress>
    </div>
  </div>
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
