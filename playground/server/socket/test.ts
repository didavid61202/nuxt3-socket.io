import { defineIOHandler } from '../../../src/module'

export default defineIOHandler((io) => {
  io.on('connection', (socket) => {
    console.log('Connected ', socket.id)

    socket.on('message', ({ msg, to }) => {
      console.log({from: socket.id,  msg, to })
      if (to === '' || to === undefined)
        io.emit('newMessage', msg)
      else
        io.to(to).emit('newMessage', msg)
    })

  })
})
