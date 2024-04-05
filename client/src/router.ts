import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import FreeForAll from './views/FreeForAll/FreeForAll.vue'
import { useAuthStore } from './stores/auth'
import SignIn from './views/auth/SignIn.vue'
import SignUp from './views/auth/SignUp.vue'
import FreeForAllLobby from './views/FreeForAll/FreeForAllLobby.vue'

export const HomeRoute = '/'
export const LoginRoute = '/login'
export const RegisterRoute = '/register'
export const FreeFforAllLobbyRoute = '/ffa/lobby'
export const FreeForAllRoomRoute = (roomId: string) => `/ffa/room/${roomId}`

const routes = [
    { path: HomeRoute, component: HomePage },
    { path: LoginRoute, component: SignIn },
    { path: RegisterRoute, component: SignUp },
    { path: FreeFforAllLobbyRoute, component: FreeForAllLobby, meta: { requiresAuth: true } },
    { path: FreeForAllRoomRoute(':roomId'), component: FreeForAll, meta: { requiresAuth: true } }
]

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()
    await auth.authReady()
    if (to.meta.requiresAuth && !auth.isSignedIn) {
        auth.returnURL = to.fullPath
        return LoginRoute
    }
})
