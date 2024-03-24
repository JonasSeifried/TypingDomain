<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { socket } from '@/socket'
import FreeForAllProgressBars from './FreeForAllProgressBars.vue'
import { useRoomStore } from '@/stores/room'
import FreeForAllReady from './FreeForAllReady.vue'

const hiddenInputField = ref<HTMLInputElement | null>(null)
const typedText = ref<string>('')
const route = useRoute()
const roomStore = useRoomStore()
var roomId = route.params.roomId as string
var lastInputEmited: string | null = null

function onInput() {
    if (lastInputEmited === typedText.value) return
    socket.emit('textFieldInput', typedText.value)
    lastInputEmited = typedText.value
}

function onDivClick() {
    if (!hiddenInputField.value) return
    hiddenInputField.value.focus()
}

function letterClass(letter: string, index: number): string {
    if (typedText.value.length <= index) return 'white_letter'
    return letter === typedText.value[index] ? 'green_letter' : 'red_letter'
}

onBeforeMount(() => {
    if (roomStore.isInRoom()) return
    roomStore.joinRoom(roomId, (err) => {
        if (err) {
            console.error(err)
        }
    })
})
</script>

<template>
    <div class="flex flex-col items-center mx-10 w-full h-[100vh]" :onClick="onDivClick">
        <h1 class="m-5 text-2xl text-white">Typing Domain</h1>
        <FreeForAllProgressBars v-if="!roomStore.roomIsWaitingForPlayers" />
        <FreeForAllReady v-else />

        <div v-if="!roomStore.roomIsWaitingForPlayers" class="flex flex-wrap w-1/2 gap-y-1">
            <span
                v-for="(item, index) in roomStore.textOfRoom"
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
