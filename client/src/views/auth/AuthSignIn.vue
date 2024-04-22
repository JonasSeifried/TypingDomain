<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const emailOrUsername = ref<string>('')
const password = ref<string>('')
const errorText = ref<string>('')
const { signIn } = useAuthStore()

async function trySignIn() {
    if (emailOrUsername.value.trim() === '') return
    const res = await signIn(emailOrUsername.value, password.value)
    if (res.isErr()) errorText.value = res.error.message
}
</script>

<template>
    <div class="flex flex-col items-center p-1 px-2">
        <div class="w-full mb-4">
            <!-- Todo: Make Username login possible -->
            <label class="block mb-2 font-bold" for="emailOrUsername">Email or Username</label>
            <input
                v-model="emailOrUsername"
                class="w-full p-2 px-3 leading-tight transition-all rounded shadow outline-none appearance-none shadow-secondary bg-background/75 focus:shadow-lg focus:shadow-secondary"
                id="emailOrUsername"
                type="text"
                placeholder="Email or Username"
                autofocus
            />
        </div>
        <div class="w-full mb-4">
            <label class="block mb-2 font-bold" for="password">Password</label>
            <input
                id="password"
                class="w-full p-2 px-3 leading-tight transition-all rounded shadow outline-none appearance-none shadow-secondary bg-background/75 focus:shadow-lg focus:shadow-secondary"
                @keypress.enter="trySignIn"
                type="password"
                v-model="password"
                placeholder="Password"
            />
        </div>
        <span
            class="w-full text-center text-rose-600 text-wrap"
            :hidden="errorText.trim() === ''"
            >{{ errorText }}</span
        >
        <button
            class="p-3 px-8 transition-all rounded bg-primary text-secondary enabled:hover:scale-105 enabled:hover:translate-y-1 enabled:hover:shadow enabled:hover:shadow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            @click="trySignIn"
            :disabled="emailOrUsername.trim() === '' || password.trim() === ''"
        >
            signIn!
        </button>
    </div>
</template>
