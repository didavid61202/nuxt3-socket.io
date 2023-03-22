import { Socket } from 'socket.io-client';
import { useState,  onMounted, onUnmounted, useIO } from '#imports'

let realtimeSocket: Socket  

export const useRealtimesocket = (option?: { onMounted?: (socket: Socket) => void, onUnmount?: (socket: Socket) => void, onConnect?: (socket: Socket) => void, onDisconnect?: (socket: Socket) => void }) => {
    const connected = useState('realtime-socket-connected', () => false)
    const socketId =  useState('realtime-socket-id')

    if (!process.client) return { realtimeSocket: undefined, connected, socketId }

    realtimeSocket = realtimeSocket || useIO()('/realtime')

    onMounted(()=>{
        option?.onMounted?.(realtimeSocket)
    })

    realtimeSocket.on('connect', () => {
        connected.value = realtimeSocket.connected
        socketId.value = realtimeSocket.id
        option?.onConnect?.(realtimeSocket)
    })

    realtimeSocket.on('disconnect', () => {
        connected.value = realtimeSocket.connected
        option?.onDisconnect?.(realtimeSocket)
    })

    onUnmounted(() => {
       option?.onUnmount?.(realtimeSocket)
    })

    return {
        realtimeSocket,
        connected,
        socketId
    }
}