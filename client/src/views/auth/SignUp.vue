<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const username = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const errorText = ref<string>('')
const { signUp } = useAuthStore()

async function trySignUp() {
    if (username.value.trim() === '') return
    const res = await signUp(username.value, email.value, password.value)
    if (!res.success) errorText.value = res.error.message
}
</script>

<template>
    <h1 class="mt-8 text-4xl">How should we call you?</h1>

    <p class="text-xl">Please let us know how we should call you</p>
    <div class="flex flex-col items-center p-1 px-2 m-4 rounded bg-zinc-800">
        <label for="username" class="text-2xl">Username</label>
        <input
            id="username"
            class="p-2 m-2 text-black rounded-md"
            type="text"
            v-model="username"
            placeholder="The typing menace"
        />
        <label for="email" class="text-2xl">Email</label>
        <input
            id="email"
            class="p-2 m-2 text-black rounded-md"
            type="email"
            v-model="email"
            placeholder="Your email address"
        />
        <input
            id="password"
            class="p-2 m-2 text-black rounded-md"
            @keypress.enter="trySignUp"
            type="password"
            v-model="password"
            placeholder="Password"
        />
        <span :hidden="errorText.trim() === ''">{{ errorText }}</span>
        <button
            class="room-button"
            @click="trySignUp"
            :disabled="username.trim() === '' || email.trim() === ''"
        >
            signUp!
        </button>
    </div>
</template>
