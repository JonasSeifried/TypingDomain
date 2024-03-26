<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth'
import { signUp, signIn } from '@/firebase/firebase'
import { onMounted, ref } from 'vue'

const username = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const { login } = useAuthStore()

const auth = getAuth()

console.log(auth.currentUser)

function trySignUp() {
    if (username.value.trim() === '') return

    signUp(email.value, password.value)
    //login(username.value)
}

function trySignIn() {
    if (username.value.trim() === '') return

    signIn(email.value, password.value)
    //login(username.value)
}
</script>

<template>
    <h1 class="text-4xl mt-8">How should we call you?</h1>

    <p class="text-xl">Please let us know how we should call you</p>
    <div class="flex flex-col m-4 p-1 px-2 items-center rounded bg-zinc-800">
        <label for="username" class="text-2xl">Username</label>
        <input
            id="username"
            class="p-2 m-2 rounded-md text-black"
            type="text"
            v-model="username"
            placeholder="The typing menace"
        />
        <label for="email" class="text-2xl">Email</label>
        <input
            id="email"
            class="p-2 m-2 rounded-md text-black"
            @keypress.enter="trySignUp"
            type="email"
            v-model="email"
            placeholder="Your email address"
        />
        <input
            id="password"
            class="p-2 m-2 rounded-md text-black"
            @keypress.enter="trySignUp"
            type="email"
            v-model="password"
            placeholder="Password"
        />
        <button
            class="room-button"
            @click="trySignUp"
            :disabled="username.trim() === '' || email.trim() === ''"
        >
            signUp!
        </button>
        <button
            class="room-button"
            @click="trySignIn"
            :disabled="username.trim() === '' || email.trim() === ''"
        >
            signIn!
        </button>
    </div>
</template>
