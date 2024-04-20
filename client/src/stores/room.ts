import { socket } from '@/socket'
import { defineStore } from 'pinia'
import { type GameState, type ClientData } from 'shared'
import { err, fromWebResult, ok, type Result } from 'shared/src/result'
import { computed, ref } from 'vue'
import { useAuthStore } from './auth'

export const useRoomStore = defineStore('room', () => {
    const joinedRoom = ref<string | null>(null)
    const isReady = ref<boolean>(false)
    const isSpectator = ref<boolean>(false)
    const isFinished = ref<boolean>(false)
    const gameState = ref<GameState>(0 as GameState.PREGAME)
    const clientsInRoom = ref<ClientData[]>([])
    const textOfRoom = ref<string>('')
    const startCountdown = ref<number | undefined>(undefined)
    const playTime = ref<number>(0)
    const authStore = useAuthStore()
    let eventsBound = false

    async function joinRoom(roomId: string, callback: (res: Result<void>) => void) {
        socket
            .timeout(5000)
            .emit('joinRoom', roomId, authStore.username!, (timeoutErr, webResult) => {
                if (timeoutErr) {
                    callback(err(timeoutErr))
                    return
                }
                const res = fromWebResult(webResult)

                if (res.isErr()) {
                    callback(err(res.error))
                    return
                }
                isReady.value = false
                isFinished.value = false
                startCountdown.value = undefined
                joinedRoom.value = roomId
                isSpectator.value = res.value
                callback(ok())
            })
    }

    function leaveRoom() {
        socket.emit('leaveRoom')
        isReady.value = false
        startCountdown.value = undefined
        isFinished.value = false
        joinedRoom.value = null
    }

    function toggleReady() {
        socket.emit('roomSetReady', !isReady.value)
        isReady.value = !isReady.value
    }

    function isInRoom() {
        return joinedRoom.value !== null
    }

    const isPreGame = computed(() => {
        return gameState.value === (0 as GameState.PREGAME)
    })

    const isInGame = computed(() => {
        return gameState.value === (1 as GameState.INGAME)
    })

    const isPostGame = computed(() => {
        return gameState.value === (2 as GameState.POSTGAME)
    })

    const isPlaying = computed(() => {
        return !isSpectator.value && !isFinished.value
    })

    function bindEvents() {
        if (eventsBound) return

        socket.on('roomDataChanged', (webResult) => {
            const result = fromWebResult(webResult)
            if (result.isErr()) {
                console.error(result.error)
                return
            }
            const clientRoomData = result.value
            gameState.value = clientRoomData.state
            textOfRoom.value = clientRoomData.text
            playTime.value = clientRoomData.playTime
        })

        socket.on('clientDataInRoomChanged', (webResult) => {
            const result = fromWebResult(webResult)
            if (result.isErr()) {
                console.error(result.error)
                return
            }
            clientsInRoom.value = result.value
        })

        socket.on('roomStartRoundCountDown', (countdown) => {
            startCountdown.value = countdown
        })

        socket.on('playerFinished', () => {
            isFinished.value = true
        })

        eventsBound = true
    }

    return {
        joinedRoom,
        clientsInRoom,
        textOfRoom,
        isReady,
        isSpectator,
        isFinished,
        gameState,
        eventsBound,
        isPreGame,
        isInGame,
        isPostGame,
        isPlaying,
        startCountdown,
        playTime,
        joinRoom,
        leaveRoom,
        toggleReady,
        isInRoom,
        bindEvents
    }
})
