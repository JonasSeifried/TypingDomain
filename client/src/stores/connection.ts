import { socket } from '@/socket'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConnectionStore = defineStore('connection', () => {
    const isConnected = ref<boolean>(false)
    const eventsBound = ref<boolean>(false)

    function bindEvents() {
        if (eventsBound.value) return
        socket.on('connect', () => {
            isConnected.value = true
        })
        socket.on('disconnect', () => {
            isConnected.value = false
        })
        eventsBound.value = true
    }

    function connect() {
        socket.connect()
    }

    return { isConnected, eventsBound, bindEvents, connect }
})
