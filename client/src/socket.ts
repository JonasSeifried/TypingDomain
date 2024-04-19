import { io, Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToCLientEvents } from 'shared'
import { useSocketStore } from './stores/socket'
import { useRoomStore } from './stores/room'

export const socket: Socket<ServerToCLientEvents, ClientToServerEvents> = io(
    'http://localhost:3000',
    {
        autoConnect: false
    }
)

export function bindEvents() {
    useSocketStore().bindEvents()
    useRoomStore().bindEvents()
    console.log('Events bound')
}
