import { defineIOHandler } from '../../../src/module'
import { createStorage } from 'unstorage'
import fsDriver from "unstorage/drivers/fs";

export default defineIOHandler(async (io) => {
    // check if is production
    // if () {
    const storage = createStorage(process.env.NODE_ENV === 'production' ? undefined : {
        driver: fsDriver({ base:'./dev-storage-db' }),
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