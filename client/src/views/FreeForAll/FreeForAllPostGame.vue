<script setup lang="ts">
import { useRoomStore } from "@/stores/room";
import type { ClientData } from "shared";
import { computed } from "vue";
import { calculateCorrectLetterCount, calculateCorrectWordCount } from "shared/statistics";

const roomStore = useRoomStore();

const sortedClientsStatistc = computed(() => {
  const playersWithStatistics = [...roomStore.clientsInRoom].map((client) => {
    return { client, statistics: calculateStatistics(client, roomStore.textOfRoom) };
  });
  return playersWithStatistics.sort((a, b) => {
    return b.statistics.lettersPerMinute - a.statistics.lettersPerMinute;
  });
});

function calculateStatistics(clientData: ClientData, roomText: string) {
  const numCorrectWords = calculateCorrectWordCount(clientData.typedText, roomText);
  const numIncorrectWords = roomText.split(" ").length - numCorrectWords;
  const numCorrectLetters = calculateCorrectLetterCount(clientData.typedText, roomText);
  const wordsPerMinute = numCorrectWords / (clientData.finishedAt / (1000 * 60));
  const lettersPerMinute = numCorrectLetters / (clientData.finishedAt / (1000 * 60));
  return {
    numCorrectWords,
    numIncorrectWords,
    numCorrectLetters,
    wordsPerMinute,
    lettersPerMinute,
  };
}
</script>

<template>
  <table class="mt-8 border-collapse shadow-xl w-fit shadow-secondary">
    <tr class="[&>th]:p-2 [&>th]:text-right [&>th]:border-2 [&>th]:border-b-4 [&>th]:border-secondary">
      <th class="text-left">Place</th>
      <th class="text-left">Username</th>
      <th>Correct Words</th>
      <th>Wrong Words</th>
      <th>Letters per minute</th>
      <th>Words per minute</th>
      <th>Time</th>
    </tr>
    <tr
      v-for="({ client, statistics }, index) in sortedClientsStatistc"
      :key="client.socketId"
      class="[&>td]:p-2 [&>td]:text-right [&>td]:border-2 [&>td]:border-secondary"
    >
      <!-- Todo: Add Tooltip for Rounded Numbers with accurate value -->
      <td class="!text-left">{{ index + 1 }}</td>
      <td class="font-bold !text-left">{{ client.username }}</td>
      <td>
        {{ statistics.numCorrectWords }}
      </td>
      <td>
        {{ statistics.numIncorrectWords }}
      </td>
      <td>
        {{ Math.round(statistics.lettersPerMinute) }}
      </td>
      <td>
        {{ Math.round(statistics.wordsPerMinute) }}
      </td>
      <td>{{ (client.finishedAt / 1000).toFixed(3) }}s</td>
    </tr>
  </table>
</template>
@/services/room