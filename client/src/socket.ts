import { io, Socket, type ManagerOptions, type SocketOptions } from 'socket.io-client'
import type { ClientToServerEvents, ServerToCLientEvents } from 'shared'
import { useSocketStore } from './stores/socket'
import { useRoomStore } from './stores/room'

const opts: Partial<ManagerOptions & SocketOptions> = {
    autoConnect: false,
    path: '/api/socket'
}
export const socket: Socket<ServerToCLientEvents, ClientToServerEvents> =
    process.env.NODE_ENV === 'production' && process.env.IS_PREVIEW !== 'true'
        ? io(opts)
        : io('http://localhost:3000', opts)

export function bindEvents() {
    useSocketStore().bindEvents()
    useRoomStore().bindEvents()
    console.log('Events bound')
}
