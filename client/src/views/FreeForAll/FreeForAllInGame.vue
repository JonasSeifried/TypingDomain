<script setup lang="ts">
import { socket } from '@/socket'
import FreeForAllProgressBars from './FreeForAllProgressBars.vue'
import { useRoomStore } from '@/stores/room'
import { computed, onMounted, ref } from 'vue'

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
    return letter === wholeText[index] ? 'green_letter' : 'red_letter'
}

function letterOpacity(index: number): number {
    if (
        !typedTextDiv.value ||
        !parentDivOfTypedDivs.value ||
        typedTextDiv.value.children.length == 0
    )
        return 1

    const letterWidth = typedTextDiv.value.children[0].clientWidth
    const fadeAfter = Math.round(parentDivOfTypedDivs.value.clientWidth / letterWidth) + 2
    return Math.min(Math.max((fadeAfter - (typedText.value.length - index)) / fadeAfter, 0), 1)
}

onMounted(() => {
    if (!parentDivOfTypedDivs.value || !inputField.value || !typedTextDiv.value) return
    const maxWidth = `${parentDivOfTypedDivs.value.clientWidth}px`
    inputField.value.style.maxWidth = maxWidth
    typedTextDiv.value.style.maxWidth = maxWidth
})
</script>

<template>
    <FreeForAllProgressBars />

    <div :onClick="onDivClick" class="flex justify-center w-full h-full">
        <div
            v-if="roomStore.isPlaying"
            ref="containerDiv"
            class="flex flex-row items-center justify-end w-1/2 h-32 p-8 text-4xl whitespace-pre bg-black rounded bg-opacity-10 letter"
        >
            <div ref="parentDivOfTypedDivs" class="grid items-end w-1/2 h-fit">
                <input
                    ref="inputField"
                    class="overflow-hidden focus:outline-none text-transparent text-right bg-transparent z-20 row-[1] col-[1]"
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
                    class="overflow-hidden focus:outline-none z-10 flex justify-end row-[1] col-[1]"
                >
                    <span
                        v-for="(item, index) in typedText"
                        :key="index"
                        class=""
                        :class="letterClass(item, index)"
                        :style="{ opacity: letterOpacity(index) }"
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
.letter {
    font-family: Hack, monospace;
}
.green_letter {
    color: rgb(30, 153, 30);
}
.red_letter {
    color: rgb(170, 26, 26);
    text-decoration: underline;
}
</style>
