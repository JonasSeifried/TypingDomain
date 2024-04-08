import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import {
    signIn as firebaseSignIn,
    signUp as firebaseSignUp,
    signOut as firebaseSignOut
} from '@/firebase/firebaseAuth'
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { ok, type Result } from 'shared'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { fireStore } from '@/firebase/firebaseInitialization'
import { HomeRoute } from '@/router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null | undefined>(undefined)
    const username = ref<string | null>(null)
    const returnURL = ref<string | null>(null)
    const router = useRouter()
    const auth = getAuth()
    onAuthStateChanged(auth, async (u) => {
        user.value = u
        if (!user.value) {
            username.value = null
            return
        }
        console.log('authorized')
        const q = query(
            collection(fireStore, 'users'),
            where('primaryEmail', '==', user.value.email)
        )
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
            username.value = querySnapshot.docs[0].data().username
        }
    })

    async function signIn(name: string, password: string): Promise<Result<void>> {
        const res = await firebaseSignIn(name, password)
        if (!res.success) return res

        router.push(returnURL.value || HomeRoute)
        return ok()
    }

    async function signUp(
        username: string,
        email: string,
        password: string
    ): Promise<Result<void>> {
        const res = await firebaseSignUp(username, email, password)
        if (!res.success) return res

        router.push(returnURL.value || HomeRoute)
        return ok()
    }

    async function signOut(): Promise<Result<void>> {
        const res = await firebaseSignOut()
        if (!res.success) return res

        router.push(HomeRoute)
        return ok()
    }

    async function authReady(): Promise<void> {
        await auth.authStateReady()
        if (user.value == null) return
        if (username.value !== null) return
        await new Promise((resolve) => {
            const unsubscribe = watchEffect(() => {
                if (username.value !== null) {
                    unsubscribe()
                    resolve(undefined)
                }
            })
        })
    }

    const isSignedIn = computed<boolean>(() => user.value !== null)

    return { user, username, returnURL, signIn, signUp, signOut, authReady, isSignedIn }
})
