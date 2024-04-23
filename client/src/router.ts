import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

export const HomeRoute = '/'
export const AuthUserRoute = '/auth'
export const FreeForAllLobbyRoute = '/ffa/lobby'
export const FreeForAllRoomRoute = (roomId: string) => `/ffa/room/${roomId}`

const routes = [
    { path: HomeRoute, component: () => import('./views/HomePage.vue') },
    { path: AuthUserRoute, component: () => import('./views/auth/AuthUser.vue') },
    {
        path: FreeForAllLobbyRoute,
        component: () => import('./views/FreeForAll/FreeForAllLobby.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: FreeForAllRoomRoute(':roomId'),
        component: () => import('./views/FreeForAll/FreeForAll.vue'),
        meta: { requiresAuth: true }
    }
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
        console.debug('Redirecting to', AuthUserRoute)
        return AuthUserRoute
    }
})
