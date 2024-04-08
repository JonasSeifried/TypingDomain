import { socket } from '@/socket'
import { defineStore } from 'pinia'
import { err, GameState, ok, type ClientData, type Result } from 'shared'
import { computed, ref } from 'vue'
import { useAuthStore } from './auth'

export const useRoomStore = defineStore('room', () => {
    const joinedRoom = ref<string | null>(null)
    const isReady = ref<boolean>(false)
    const isSpectator = ref<boolean>(false)
    const gameState = ref<GameState>(GameState.WAITING)
    const clientsInRoom = ref<ClientData[]>([])
    const textOfRoom = ref<string>('')
    const eventsBound = ref<boolean>(false)
    const startCountdown = ref<number | undefined>(undefined)
    const gameTimer = ref<number>(0)
    const authStore = useAuthStore()

    async function joinRoom(roomId: string, callback: (res: Result<void>) => void) {
        socket.timeout(5000).emit('joinRoom', roomId, authStore.username!, (timeoutErr, res) => {
            if (timeoutErr) {
                callback(err(timeoutErr))
                return
            }

            if (!res.success) {
                callback(err(res.error))
                return
            }

            joinedRoom.value = roomId
            isSpectator.value = res.result
            console.log(`joined room ${roomId} as a `, res.result ? 'spectator' : 'player')
            callback(ok())
        })
    }

    function toggleReady() {
        socket.emit('roomSetReady', !isReady.value)
        isReady.value = !isReady.value
    }

    function isInRoom() {
        return joinedRoom.value !== null
    }

    const isWaiting = computed(() => {
        return gameState.value === GameState.WAITING
    })

    const isPlaying = computed(() => {
        return gameState.value === GameState.PLAYING
    })

    const isFinished = computed(() => {
        return gameState.value === GameState.FINISHED
    })

    function bindEvents() {
        if (eventsBound.value) return

        socket.on('roomDataChanged', (clientRoomData) => {
            gameState.value = clientRoomData.state
            textOfRoom.value = clientRoomData.text
        })

        socket.on('clientDataInRoomChanged', (clients) => {
            clientsInRoom.value = clients
        })

        socket.on('roomStartRoundCountDown', (countdown) => {
            startCountdown.value = countdown
        })

        socket.on('roomGameTimer', (gameTime) => {
            gameTimer.value = gameTime
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
        isWaiting,
        isPlaying,
        isFinished,
        startCountdown,
        gameTimer,
        joinRoom,
        toggleReady,
        isInRoom,
        bindEvents
    }
})
