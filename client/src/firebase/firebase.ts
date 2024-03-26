import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID,
    measurementId: import.meta.env.VITE_MEASUREMENTID
}

export function initializeFirebase() {
    const firebaseApp = initializeApp(firebaseConfig)
    const analytics = getAnalytics(firebaseApp)
}

export function signUp(email: string, password: string) {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user
            console.log('signed up!')
            // ...
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.error(errorCode, errorMessage)
            // ..
        })
}

export function signIn(email: string, password: string) {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user
            console.log('signed in!')
            // ...
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.error(errorCode, errorMessage)
        })
}
