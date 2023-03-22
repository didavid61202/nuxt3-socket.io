import { defineIOHandler } from '../../../src/module'
import { createStorage } from 'unstorage'
import redisDriver from "unstorage/drivers/redis";

export default defineIOHandler(async (io) => {
    const storage = createStorage( {
        driver: redisDriver({ url: process.env.REDIS_URL })
    })

    const rtio = io.of('/realtime')

    rtio.on('connection', (socket) => {
        console.log('Connected to realtime ', socket.id)

        socket.on('set',async ({ key, value }) => {
            // console.log({ from: socket.id, key, value })
            await storage.setItem(key, value)
            const newvalue = await storage.getItem(key)
            console.log(`io is emiting update:${key} of value ${newvalue} to room watch:${key}`)
            rtio.in(`watch:${key}`).emit(`update:${key}`, newvalue)
        })

        socket.on('watch', async ({ key })=>{
            console.log(`socket: ${socket.id} is watching ${key}`)
            if(socket.rooms.has(`watch:${key}`)){
                console.log(`socket is already in room watch:${key}`)
                return
            }
            const value = await storage.getItem(key)
            socket.emit(`update:${key}`, value)
            socket.join(`watch:${key}`)
        })

        socket.on('unwatch',({ key })=>{
            console.log(`socket: ${socket.id} is unwatching ${key}`)
            socket.leave(`watch:${key}`)
        })

        socket.on('disconnect', () => {
            console.log('Disconnected from realtime ', socket.id)
        })
    })
})