import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import FreeForAll from './views/FreeForAll/FreeForAll.vue'
import { useAuthStore } from './stores/auth'
import FreeForAllLobby from './views/FreeForAll/FreeForAllLobby.vue'
import AuthUser from './views/auth/AuthUser.vue'

export const HomeRoute = '/'
export const AuthUserRoute = '/auth'
export const FreeForAllLobbyRoute = '/ffa/lobby'
export const FreeForAllRoomRoute = (roomId: string) => `/ffa/room/${roomId}`

const routes = [
    { path: HomeRoute, component: HomePage },
    { path: AuthUserRoute, component: AuthUser },
    { path: FreeForAllLobbyRoute, component: FreeForAllLobby, meta: { requiresAuth: true } },
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
        console.log('Redirecting to', AuthUserRoute)
        return AuthUserRoute
    }
})
