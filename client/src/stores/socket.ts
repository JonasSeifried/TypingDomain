import { socket } from '@/socket'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSocketStore = defineStore('socket', () => {
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

    function disconnect() {
        socket.disconnect()
    }

    return { isConnected, socketId, eventsBound, bindEvents, connect, disconnect }
})
