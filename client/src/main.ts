import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './components/HomePage.vue'
import TheMain from './components/TheMain.vue'

const routes = [
    { path: '/', component: HomePage },
    { path: '/room/:roomId', component: TheMain }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})




createApp(App).use(router).mount('#app')
