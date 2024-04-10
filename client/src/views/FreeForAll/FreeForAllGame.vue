<script setup lang="ts">
import { socket } from '@/socket'
import FreeForAllProgressBars from './FreeForAllProgressBars.vue'
import { useRoomStore } from '@/stores/room'
import { computed, onMounted, ref } from 'vue'

const roomStore = useRoomStore()

const parentWritableDiv = ref<HTMLDivElement | null>(null)
const writableDiv = ref<HTMLDivElement | null>(null)
const typedTextDiv = ref<HTMLDivElement | null>(null)
const typedText = ref<string>('')
const wholeText = roomStore.textOfRoom
const remainingText = computed<string>(() => wholeText.substring(typedText.value.length))

function onInput() {
    if (!writableDiv.value) return
    if (writableDiv.value.innerText.length === 1) {
        writableDiv.value.innerText = writableDiv.value.innerText.replace('\n', '')
        setCursorToEnd()
    }
    typedText.value = writableDiv.value.innerText
    socket.emit('textFieldInput', typedText.value)
    return
}

function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
        event.preventDefault()
        return
    }
    if (event.key !== ' ') return
    if (!writableDiv.value) return
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
    return letter === wholeText[index] ? 'green_letter' : 'red_letter'
}
function letterOpacity(index: number): number {
    if (typedText.value.length - index < 10) return 1
    return 1 - (typedText.value.length - index) / 25
}

onMounted(() => {
    if (!parentWritableDiv.value || !writableDiv.value || !typedTextDiv.value) return
    const maxWidth = `${parentWritableDiv.value.offsetWidth / 2}px`
    writableDiv.value.style.maxWidth = maxWidth
    typedTextDiv.value.style.maxWidth = maxWidth
    writableDiv.value.focus()
})
</script>

<template>
    <FreeForAllProgressBars />
    <span class="relative right-0 ml-20">{{ roomStore.gameTimer }}</span>
    <div
        :onClick="onDivClick"
        class="p-8 bg-stone-700 rounded flex flex-row justify-center focus-within:outline text-2xl letter whitespace-pre select-none"
    >
        <div ref="parentWritableDiv" class="flex justify-end bg-stone-800 w-[48rem] py-4">
            <div class="text-right flex justify-end w-1/2">
                <div
                    ref="writableDiv"
                    class="overflow-hidden focus:outline-none absolute text-transparent bg-clip-text caret-white z-20"
                    contenteditable="true"
                    spellcheck="false"
                    autocapitalize="false"
                    autocorrect="false"
                    @keydown="onKeyDown"
                    @input="onInput"
                ></div>
                <div
                    id="typedTextDiv"
                    ref="typedTextDiv"
                    class="overflow-hidden focus:outline-none z-10 absolute flex justify-end"
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
            <div class="truncate w-1/2 whitespace-pre">{{ remainingText }}</div>
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
