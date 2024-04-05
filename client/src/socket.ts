import { io, Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToCLientEvents } from 'shared'
import { useSocketStore } from './stores/socket'
import { useRoomStore } from './stores/room'

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000'
export const socket: Socket<ServerToCLientEvents, ClientToServerEvents> = io(URL!, {
    autoConnect: false
})

export function bindEvents() {
    useSocketStore().bindEvents()
    useRoomStore().bindEvents()
    console.log('Events bound')
}
