import { socket } from '@/socket'
import { defineStore } from 'pinia'
import type { ClientData } from 'shared'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useRoomStore = defineStore('room', () => {
    const joinedRoom = ref<string | null>(null)
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

    function bindEvents() {
        if (eventsBound.value) return
        socket.on('startRound', (text) => {
            textOfRoom.value = text
        })

        socket.on('clientConnectedToSameRoom', (clients) => {
            console.log('event: clientConnectedToSameRoom')
            clientsInRoom.value = clients
        })

        eventsBound.value = true
    }

    return { joinedRoom, clientsInRoom, textOfRoom, eventsBound, joinRoom, bindEvents }
})
