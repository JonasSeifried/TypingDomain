<script setup lang="ts">
import FreeForAllProgressBars from './FreeForAllProgressBars.vue'
import { useRoomStore } from '@/stores/room'
import { computed, onMounted, ref } from 'vue'

const roomStore = useRoomStore()

const writableDiv = ref<HTMLDivElement | null>(null)
const typedText = ref<string>('')
const editableText = ref<string>('')
const textToWrite = computed<string>(() => remainingText.value.split(' ', 2).join(' '))
const remainingText = ref<string>('')

function onInput(payload: Event) {
    // if (lastInputEmited === typedText.value) return
    // socket.emit('textFieldInput', typedText.value)
    // lastInputEmited = typedText.value
    if (!writableDiv.value) return
    editableText.value = writableDiv.value.innerText
    return
}

function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
        event.preventDefault()
        return
    }
    if (event.key !== ' ') return
    if (!writableDiv.value) return
    const trimmedText = writableDiv.value.innerText.trim()
    if (!trimmedText.includes(' ')) return
    const indexOfSpace = trimmedText.indexOf(' ')
    const firstWord = trimmedText.substring(0, indexOfSpace + 1)
    const secondWord = trimmedText.substring(indexOfSpace + 1)
    typedText.value += firstWord
    writableDiv.value.innerText = secondWord
    remainingText.value = remainingText.value.slice(firstWord.length)

    setCursorToEnd()
}

function setCursorToEnd() {
    if (!writableDiv.value) return
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(writableDiv.value)
    range.collapse(false)
    selection?.removeAllRanges()
    selection?.addRange(range)
    writableDiv.value.focus()
}

function onDivClick() {
    setCursorToEnd()
}

function letterClass(letter: string, index: number): string {
    return letter === textToWrite.value[index] ? 'green_letter' : 'red_letter'
}

onMounted(() => {
    //remainingText.value = roomStore.textOfRoom
    remainingText.value =
        'The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog'
    setCursorToEnd()
})
</script>

<template>
    <FreeForAllProgressBars />
    <span class="relative right-0 ml-20">{{ roomStore.gameTimer }}</span>
    <div
        :onClick="onDivClick"
        class="p-8 bg-stone-700 rounded flex flex-row justify-center focus-within:outline text-2xl letter whitespace-pre select-none"
    >
        <div class="flex justify-end w-96 bg-stone-600 text-nowrap py-4 gap-1 text-right">
            <div class="min-w-0 text-opacity-50">
                {{ typedText }}
            </div>
        </div>
        <div class="bg-stone-800 w-96 py-4">
            <div
                ref="writableDiv"
                class="w-min min-w-16 overflow-hidden focus:outline-none absolute text-transparent caret-white z-20"
                contenteditable="true"
                @keydown="onKeyDown"
                @input="onInput"
            ></div>
            <div class="w-min min-w-16 overflow-hidden focus:outline-none z-10 absolute">
                <span
                    v-for="(item, index) in editableText"
                    :key="index"
                    class="bg-stone-800"
                    :class="letterClass(item, index)"
                >
                    {{ item }}
                </span>
            </div>
            <div class="truncate">{{ remainingText }}</div>
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
    text-decoration: line-through;
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
