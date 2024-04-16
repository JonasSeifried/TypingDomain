<script setup lang="ts">
import { useRoomStore } from '@/stores/room'
import type { ClientData } from 'shared'
import { computed } from 'vue'

const roomStore = useRoomStore()

const sortedClientsStatistc = computed(() => {
    const playersWithStatistics = [...roomStore.clientsInRoom].map((client) => {
        return { client, statistics: calculateStatistics(client, roomStore.textOfRoom) }
    })
    return playersWithStatistics.sort((a, b) => {
        return b.statistics.lettersPerMinute - a.statistics.lettersPerMinute
    })
})

function calculateStatistics(clientData: ClientData, roomText: string) {
    const numCorrectWords = clientData.typedText
        .split(' ')
        .filter((word, index) => word === roomText.split(' ')[index]).length
    const numIncorrectWords = roomText.split(' ').length - numCorrectWords
    const numCorrectLetters = clientData.typedText
        .split('')
        .filter((letter, index) => letter === roomText[index]).length
    const wordsPerMinute = numCorrectWords / (clientData.finishedAt / 60)
    const lettersPerMinute = numCorrectLetters / (clientData.finishedAt / 60)
    return {
        numCorrectWords,
        numIncorrectWords,
        numCorrectLetters,
        wordsPerMinute,
        lettersPerMinute
    }
}
</script>

<template>
    <table class="w-1/2 mt-8 border-collapse shadow-xl shadow-black">
        <tr>
            <th>Place</th>
            <th>Username</th>
            <th>Correct Words</th>
            <th>Wrong Words</th>
            <th>Letters per minute</th>
            <th>Words per minute</th>
            <th>Time</th>
        </tr>
        <tr v-for="({ client, statistics }, index) in sortedClientsStatistc" :key="client.socketId">
            <!-- Todo: Add Tooltip for Rounded Numbers with accurate value -->
            <td>{{ index + 1 }}</td>
            <td>{{ client.username }}</td>
            <td>{{ statistics.numCorrectWords }}</td>
            <td>
                {{ statistics.numIncorrectWords }}
            </td>
            <td>{{ Math.round(statistics.lettersPerMinute) }}</td>
            <td>{{ Math.round(statistics.wordsPerMinute) }}</td>
            <td>{{ client.finishedAt / 1000 }}s</td>
        </tr>
    </table>
</template>

<style scoped>
td,
th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}
</style>
