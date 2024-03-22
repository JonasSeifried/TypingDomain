import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore(
    'auth',
    () => {
        const username = ref<string | null>(null)
        const returnURL = ref<string | null>(null)
        const router = useRouter()

        function login(name: string) {
            if (name.trim() === '') return
            username.value = name
            localStorage.setItem('user', JSON.stringify(username.value))
            router.push(returnURL.value || '/')
        }

        function logout() {
            username.value = null
            router.push('/')
        }

        const isAuthorized = computed<boolean>(() => username.value !== null)

        return { username, returnURL, login, logout, isAuthorized }
    },
    { persist: true }
)
