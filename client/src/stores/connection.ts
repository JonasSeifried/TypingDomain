import { socket } from '@/socket'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConnectionStore = defineStore('connection', () => {
    const isConnected = ref<boolean>(false)
    const eventsBound = ref<boolean>(false)
    const socketId = ref<string>()

    function bindEvents() {
        if (eventsBound.value) return
        socket.on('connect', () => {
            isConnected.value = true
            socketId.value = socket.id
        })
        socket.on('disconnect', () => {
            isConnected.value = false
            socketId.value = undefined
        })
        eventsBound.value = true
    }

    function connect() {
        socket.connect()
    }

    return { isConnected, socketId, eventsBound, bindEvents, connect }
})
