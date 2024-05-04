<script setup lang="ts">
import FreeForAllReady from "./FreeForAllReady.vue";
import CountDown from "@/components/CountDown.vue";
import { useRoomStore } from "@/stores/room";

const roomStore = useRoomStore();
</script>

<template>
  <FreeForAllReady />
  <CountDown v-if="roomStore.isPreGame && roomStore.startCountdown" :time="roomStore.startCountdown" />
</template>
@/services/room
