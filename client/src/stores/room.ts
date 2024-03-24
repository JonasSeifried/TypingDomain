import { socket } from '@/socket'
import { defineStore } from 'pinia'
import { GameState, type ClientData } from 'shared'
import { computed, ref } from 'vue'
import { useAuthStore } from './auth'

export const useRoomStore = defineStore('room', () => {
    const joinedRoom = ref<string | null>(null)
    const isReady = ref<boolean>(false)
    const isSpectator = ref<boolean>(false)
    const gameState = ref<GameState>(GameState.WAITING)
    const clientsInRoom = ref<ClientData[]>([])
    const textOfRoom = ref<string>('')
    const authStore = useAuthStore()
    const eventsBound = ref<boolean>(false)

    function joinRoom(roomId: string, callback: (err?: Error) => void) {
        socket
            .timeout(5000)
            .emit('joinRoom', roomId, authStore.username!, (timeoutErr, err, joinedAsSpectator) => {
                if (timeoutErr) {
                    callback(timeoutErr)
                    return
                }

                if (err) {
                    callback(err)
                    return
                }

                joinedRoom.value = roomId
                isSpectator.value = joinedAsSpectator ?? false

                callback()
            })
    }

    function toggleReady() {
        socket.emit('roomSetReady', !isReady.value)
        isReady.value = !isReady.value
    }

    function isInRoom() {
        return joinedRoom.value !== null
    }

    const roomIsWaitingForPlayers = computed(() => {
        return gameState.value === GameState.WAITING
    })

    function bindEvents() {
        if (eventsBound.value) return

        socket.on('roomDataChanged', (state, text) => {
            gameState.value = state
            textOfRoom.value = text
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
        isSpectator,
        gameState,
        eventsBound,
        roomIsWaitingForPlayers,
        joinRoom,
        toggleReady,
        isInRoom,
        bindEvents
    }
})
