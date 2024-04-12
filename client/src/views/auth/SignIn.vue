<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const emailOrUsername = ref<string>('')
const password = ref<string>('')
const { signIn } = useAuthStore()

function trySignIn() {
    if (emailOrUsername.value.trim() === '') return
    try {
        signIn(emailOrUsername.value, password.value)
    } catch (error) {
        if (error instanceof Error) console.error(error.message)
        else console.error(error)
    }
}
</script>

<template>
    <h1 class="mt-8 text-4xl">How should we call you?</h1>

    <p class="text-xl">Please let us know how we should call you</p>
    <div class="flex flex-col items-center p-1 px-2 m-4 rounded bg-zinc-800">
        <label for="emailOrUsername" class="text-2xl">email or username</label>
        <input
            id="emailOrUsername"
            class="p-2 m-2 text-black rounded-md"
            type="email"
            v-model="emailOrUsername"
            placeholder="Your email address"
        />
        <input
            id="password"
            class="p-2 m-2 text-black rounded-md"
            @keypress.enter="trySignIn"
            type="password"
            v-model="password"
            placeholder="Password"
        />
        <button class="room-button" @click="trySignIn" :disabled="emailOrUsername.trim() === ''">
            signIn!
        </button>
    </div>
</template>
@/firebase/firebaseInitialization
