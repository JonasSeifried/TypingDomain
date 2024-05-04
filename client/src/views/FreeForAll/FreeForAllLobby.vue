<script setup lang="ts">
import { socket } from "@/socket";
import { useAuthStore } from "@/stores/auth";
import { useRoomStore } from "@/stores/room";
import { ref } from "vue";
import { useRouter } from "vue-router";
// import { FreeForAllRoomRoute } from "@/router";

const validatingError = ref("");
const roomId = ref(socket.id!);
const router = useRouter();
const authStore = useAuthStore();
const { joinRoom } = useRoomStore();

function onSubmit() {
  if (!validate()) return;
  joinRoom(roomId.value, (res) => {
    if (res.isErr()) {
      // Todo: Error handling
      console.error(res.error);
      return;
    }
    // router.push(FreeForAllRoomRoute(roomId.value));
  });
}

function validate() {
  if (roomId.value === "") {
    validatingError.value = "Room id cannot be empty";
    return false;
  }
  return true;
}
</script>

<template>
  <div
    v-if="authStore.isSignedIn"
    class="flex flex-col items-center w-1/2 h-64 mt-16 rounded-lg shadow-2xl bg-secondary/25 shadow-secondary/50"
  >
    <h2 class="m-4 text-2xl">Join or Create a Room</h2>
    <div class="flex flex-col m-2">
      <label for="roomId">Room Id</label>
      <input
        id="roomId"
        @keypress.enter="onSubmit"
        class="w-full p-2 px-3 leading-tight transition-all rounded shadow outline-none appearance-none shadow-secondary bg-background/75 focus:shadow-lg focus:shadow-secondary"
        type="text"
        v-model="roomId"
      />
    </div>

    <p id="error-text" :hidden="!validatingError" class="font-bold text-rose-600">
      {{ validatingError }}
    </p>
    <button
      class="p-3 px-8 transition-all rounded bg-primary text-secondary hover:shadow-primary/25 hover:scale-105 hover:translate-y-1 hover:shadow-2xl"
      @click="onSubmit"
      :disabled="roomId === ''"
    >
      Join Room
    </button>
  </div>
</template>
@/services/auth@/services/room