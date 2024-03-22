import { io, Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToCLientEvents } from 'shared'
import { useConnectionStore } from './stores/connection'
import { useRoomStore } from './stores/room'

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000'
export const socket: Socket<ServerToCLientEvents, ClientToServerEvents> = io(URL!, {
    autoConnect: false
})

export function bindEvents() {
    useConnectionStore().bindEvents()
    useRoomStore().bindEvents()
    console.log('Events bound')
}
