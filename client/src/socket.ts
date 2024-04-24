import { io, Socket, type ManagerOptions, type SocketOptions } from 'socket.io-client'
import type { ClientToServerEvents, ServerToCLientEvents } from 'shared'
import { useSocketStore } from './stores/socket'
import { useRoomStore } from './stores/room'

const opts: Partial<ManagerOptions & SocketOptions> = {
    autoConnect: false,
    path: '/api/socket'
}

export const socket: Socket<ServerToCLientEvents, ClientToServerEvents> = io(
    import.meta.env.VITE_API_URL,
    opts
)

export function bindEvents() {
    useSocketStore().bindEvents()
    useRoomStore().bindEvents()
    console.debug('Events bound')
}
