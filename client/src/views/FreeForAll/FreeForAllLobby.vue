<script setup lang="ts">
import { socket } from '@/socket'
import { useAuthStore } from '@/stores/auth'
import { useRoomStore } from '@/stores/room'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FreeForAllRoomRoute, LoginRoute } from '@/router'

const validatingError = ref('')
const roomId = ref(socket.id!)
const router = useRouter()
const authStore = useAuthStore()
const { joinRoom } = useRoomStore()

function onSubmit() {
    if (!validate()) return
    joinRoom(roomId.value, (res) => {
        if (!res.success) {
            console.error(res.error)
            return
        }
        router.push(FreeForAllRoomRoute(roomId.value))
    })
}

function playAsGuest() {
    router.push(LoginRoute)
}

function validate() {
    if (roomId.value === '') {
        validatingError.value = 'Room id cannot be empty'
        return false
    }
    return true
}
</script>

<template>
    <h1 class="mb-8 text-6xl">Typing Domain</h1>
    <div
        v-if="authStore.isSignedIn"
        class="flex flex-col items-center w-1/2 h-64 rounded-lg bg-zinc-800"
    >
        <h2 class="m-4 text-2xl">Join or Create a Room</h2>
        <div class="flex">
            <div class="flex flex-col m-2">
                <label for="roomId">Room Id</label>
                <input
                    id="roomId"
                    @keypress.enter="onSubmit"
                    class="p-2 text-black rounded-md"
                    type="text"
                    v-model="roomId"
                />
            </div>
        </div>

        <p id="error-text" :hidden="!validatingError" class="text-red-500">{{ validatingError }}</p>
        <button class="room-button" @click="onSubmit" :disabled="roomId === ''">Join Room</button>
    </div>

    <button v-else class="mt-12 room-button" @click="playAsGuest">Play as Guest</button>
</template>
