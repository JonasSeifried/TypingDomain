<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const isDarkMode = ref<boolean>(document.body.classList.contains('dark'))
const preferedColorScheme = ref<string>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
)
function onToggleDarkMode() {
    document.body.classList.toggle('dark')
    isDarkMode.value = document.body.classList.contains('dark')
    localStorage.setItem('color-scheme', isDarkMode.value ? 'dark' : 'light')
}

function listenPreferedColorScheme() {
    const preferedColorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    preferedColorSchemeMediaQuery.addEventListener('change', (e) => {
        preferedColorScheme.value = e.matches ? 'dark' : 'light'
        if (localStorage.getItem('color-scheme')) return
        document.body.classList.toggle('dark', e.matches)
        isDarkMode.value = e.matches
    })
}

onBeforeMount(() => {
    listenPreferedColorScheme()

    const colorScheme = localStorage.getItem('color-scheme')
    document.body.classList.toggle('dark', colorScheme === 'dark')
    isDarkMode.value = document.body.classList.contains('dark')
})
</script>

<template>
    <button @click="onToggleDarkMode">
        {{ isDarkMode ? '🌞' : '🌚' }}
    </button>
</template>
