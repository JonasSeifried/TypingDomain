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
                class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
                class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                @keypress.enter="trySignIn"
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
            class="w-3/4 room-button"
            @click="trySignIn"
            :disabled="emailOrUsername.trim() === '' || password.trim() === ''"
        >
            signIn!
        </button>
    </div>
</template>
