<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const username = ref('')
const { login } = useAuthStore()

function submit() {
    if (username.value.trim() === '') return

    login(username.value)
}
</script>

<template>
    <h1 class="text-4xl mt-8">How should we call you?</h1>

    <p class="text-xl">Please let us know how we should call you</p>
    <div class="flex flex-col m-4 p-1 px-2 items-center rounded bg-zinc-800">
        <label for="username-input" class="text-2xl">Username</label>
        <input
            id="username-input"
            class="p-2 m-2 rounded-md text-black"
            @keypress.enter="submit"
            type="text"
            v-model="username"
            placeholder="The typing menace"
        />
        <button class="room-button" @click="submit" :disabled="username.trim() === ''">
            Login!
        </button>
    </div>
</template>
