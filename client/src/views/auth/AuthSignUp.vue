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
    if (res.isErr()) errorText.value = res.error.message
}
</script>

<template>
    <div class="flex flex-col items-center p-1 px-2">
        <div class="w-full mb-4">
            <label class="block mb-2 font-bold" for="username">Username</label>
            <input
                v-model="username"
                class="w-full p-2 px-3 leading-tight transition-all rounded shadow outline-none appearance-none shadow-secondary bg-background/75 focus:shadow-lg focus:shadow-secondary"
                id="username"
                type="text"
                placeholder="The typing menace"
            />
        </div>
        <div class="w-full mb-4">
            <label class="block mb-2 font-bold" for="email">Email</label>
            <input
                v-model="email"
                class="w-full p-2 px-3 leading-tight transition-all rounded shadow outline-none appearance-none shadow-secondary bg-background/75 focus:shadow-lg focus:shadow-secondary"
                id="email"
                type="text"
                placeholder="Your Email Address"
            />
        </div>
        <div class="w-full mb-4">
            <label class="block mb-2 font-bold" for="password">Passowrd</label>
            <input
                class="w-full p-2 px-3 leading-tight transition-all rounded shadow outline-none appearance-none shadow-secondary bg-background/75 focus:shadow-lg focus:shadow-secondary"
                @keypress.enter="trySignUp"
                type="password"
                v-model="password"
                placeholder="Password"
            />
        </div>

        <span
            class="w-full text-center text-rose-500 text-wrap"
            :hidden="errorText.trim() === ''"
            >{{ errorText }}</span
        >
        <button
            class="p-3 px-8 transition-all rounded bg-primary text-secondary enabled:hover:scale-105 enabled:hover:translate-y-1 enabled:hover:shadow enabled:hover:shadow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            @click="trySignUp"
            :disabled="username.trim() === '' || email.trim() === '' || password.trim() === ''"
        >
            signUp!
        </button>
    </div>
</template>
