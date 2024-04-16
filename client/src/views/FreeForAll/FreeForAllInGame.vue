<script setup lang="ts">
import { socket } from '@/socket'
import FreeForAllProgressBars from './FreeForAllProgressBars.vue'
import { useRoomStore } from '@/stores/room'
import { computed, ref } from 'vue'

const roomStore = useRoomStore()

const containerDiv = ref<HTMLDivElement | null>(null)
const inputField = ref<HTMLInputElement | null>(null)
const typedTextDiv = ref<HTMLDivElement | null>(null)
const parentDivOfTypedDivs = ref<HTMLDivElement | null>(null)
const typedText = ref<string>('')
const wholeText = roomStore.textOfRoom
const remainingText = computed<string>(() => wholeText.substring(typedText.value.length))
const inputFieldClass = ref<string>('')

function onInput() {
    if (!inputField.value) return

    typedText.value = inputField.value.value
    socket.emit('textFieldInput', typedText.value)
    return
}

function onKeyUp() {
    inputFieldClass.value = calculateInputFieldClass()
}

function calculateInputFieldClass(): string {
    if (!inputField.value?.selectionStart) return 'caret-white'
    return inputField.value.selectionStart - inputField.value.value.length == 0
        ? 'caret-transparent'
        : 'caret-white'
}

function onDivClick() {
    inputField.value?.focus()
}

function letterClass(letter: string, index: number): string {
    return letter === wholeText[index] ? 'letter_correct' : 'letter_incorrect'
}
</script>

<template>
    <FreeForAllProgressBars />

    <div :onClick="onDivClick" class="flex justify-center w-full h-full m-8">
        <div
            v-if="roomStore.isPlaying"
            id="containerDiv"
            ref="containerDiv"
            class="flex flex-row items-center justify-end w-1/2 h-32 p-8 text-4xl whitespace-pre rounded shadow-[0_5px_60px_15px_rgba(0,0,0,0.75)] shadow-black letter"
        >
            <div ref="parentDivOfTypedDivs" class="grid items-end w-1/2 h-fit">
                <input
                    ref="inputField"
                    class="overflow-hidden focus:outline-none text-transparent text-right bg-transparent z-20 row-[1] col-[1] w-full"
                    :class="inputFieldClass"
                    spellcheck="false"
                    autocapitalize="false"
                    autocorrect="false"
                    autofocus="true"
                    @input="onInput"
                    @keyup="onKeyUp"
                />
                <div
                    id="typedTextDiv"
                    ref="typedTextDiv"
                    class="overflow-hidden focus:outline-none z-10 flex justify-end row-[1] col-[1] w-full"
                >
                    <span
                        v-for="(item, index) in typedText"
                        :key="index"
                        :class="letterClass(item, index)"
                    >
                        {{ item }}
                    </span>
                </div>
            </div>
            <div class="w-1/2 truncate whitespace-pre">{{ remainingText }}</div>
        </div>
    </div>
</template>

<style scoped>
#typedTextDiv {
    -webkit-mask-image: linear-gradient(to left, black, transparent);
    mask-image: linear-gradient (to left, black, transparent);
}
.letter {
    font-family: Hack, monospace;
}
.letter_correct {
    color: rgb(30, 153, 30);
}
.letter_incorrect {
    color: rgb(170, 26, 26);
    text-decoration: underline;
}
</style>
