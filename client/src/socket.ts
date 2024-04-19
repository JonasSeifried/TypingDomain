import { io, Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToCLientEvents } from 'shared'
import { useSocketStore } from './stores/socket'
import { useRoomStore } from './stores/room'

const URL =
    process.env.NODE_ENV === 'production'
        ? window.location.origin + '/backend'
        : 'http://localhost:3000'
export const socket: Socket<ServerToCLientEvents, ClientToServerEvents> = io(URL, {
    autoConnect: false
})

export function bindEvents() {
    useSocketStore().bindEvents()
    useRoomStore().bindEvents()
    console.log('Events bound')
}
