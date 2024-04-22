<script setup lang="ts">
import { ref } from 'vue'
import AuthSignIn from './AuthSignIn.vue'
import AuthSignUp from './AuthSignUp.vue'
import AuthGuest from './AuthGuest.vue'

type Tabs = 'SignIn' | 'SignUp' | 'Guest'

const selectedTab = ref<Tabs>('SignIn')
</script>

<template>
    <div class="flex justify-center w-full mt-16">
        <div class="flex flex-col items-center w-1/3 pb-2 rounded-lg bg-secondary/25">
            <ul class="grid w-full grid-flow-col mb-4 text-sm text-center border-b border-gray-700">
                <li @click="selectedTab = 'SignIn'">
                    <a
                        href="#"
                        class="inline-block w-full p-4 rounded-tl-lg hover:bg-primary"
                        :class="{ 'text-text bg-secondary': selectedTab === 'SignIn' }"
                        >SignIn</a
                    >
                </li>
                <li @click="selectedTab = 'SignUp'">
                    <a
                        href="#"
                        class="inline-block w-full p-4 hover:bg-primary"
                        :class="{ 'text-text bg-secondary': selectedTab === 'SignUp' }"
                        >SignUp</a
                    >
                </li>
                <li @click="selectedTab = 'Guest'">
                    <a
                        href="#"
                        class="inline-block w-full p-4 rounded-tr-lg hover:bg-primary"
                        :class="{ 'text-text bg-secondary': selectedTab === 'Guest' }"
                        >Guest</a
                    >
                </li>
            </ul>
            <AuthSignIn class="w-3/5" v-if="selectedTab === 'SignIn'" />
            <AuthSignUp class="w-3/5" v-else-if="selectedTab === 'SignUp'" />
            <AuthGuest class="w-3/5" v-else-if="selectedTab === 'Guest'" />
        </div>
    </div>
</template>

<style scoped></style>
