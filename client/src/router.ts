import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import TheMain from './views/FreeForAll/FreeForAll.vue'
import { useAuthStore } from './stores/auth'
import AppLogin from './views/AppLogin.vue'

const routes = [
    { path: '/', component: HomePage },
    { path: '/login', component: AppLogin },
    { path: '/room/:roomId', component: TheMain, meta: { authRequired: true } }
]

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.meta.authRequired && !auth.username) {
        auth.returnURL = to.fullPath
        return '/login'
    }
})
