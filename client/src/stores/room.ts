import { socket } from '@/socket'
import { defineStore } from 'pinia'
import type { ClientData } from 'shared'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useRoomStore = defineStore('room', () => {
    const joinedRoom = ref<string | null>(null)
    const isReady = ref<boolean>(false)
    const roomStarted = ref<boolean>(false)
    const clientsInRoom = ref<ClientData[]>([])
    const textOfRoom = ref<string>('')
    const authStore = useAuthStore()
    const eventsBound = ref<boolean>(false)

    function joinRoom(roomId: string, callback: (err?: Error) => void) {
        socket.timeout(5000).emit('joinRoom', roomId, authStore.username!, (err) => {
            if (err) {
                callback(err)
                return
            }
            joinedRoom.value = roomId
            callback()
        })
    }

    function toggleReady() {
        socket.emit('roomSetReady', !isReady.value)
        isReady.value = !isReady.value
    }

    function bindEvents() {
        if (eventsBound.value) return
        socket.on('startRound', (text) => {
            textOfRoom.value = text
            roomStarted.value = true
        })

        socket.on('clientDataInRoomChanged', (clients) => {
            clientsInRoom.value = clients
        })

        eventsBound.value = true
    }

    return {
        joinedRoom,
        clientsInRoom,
        textOfRoom,
        isReady,
        roomStarted,
        eventsBound,
        joinRoom,
        toggleReady,
        bindEvents
    }
})
