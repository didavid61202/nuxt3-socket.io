import { instrument } from '@socket.io/admin-ui'
import { defineIOHandler } from '../../../src/module'

export default defineIOHandler((io) => {
  // setup offical socket.io admin ui at https://admin.socket.io/
  instrument(io, {
    // auth: false
    auth: {
      type: 'basic',
      username: process.env.SOCKETIO_ADMIN_USERNAME || '',
      password: process.env.SOCKETIO_ADMIN_PASSWORD || '' // password encrypted with bcrypt
    }
  })

  io.on('connection', (socket) => {
    console.log('Connected ', socket.id)

    socket.on('message', ({ msg, to }) => {
      console.log({ from: socket.id, msg, to })
      if (to === '' || to === undefined) { io.emit('newMessage', msg) } else { io.to(to).emit('newMessage', msg) }
    })
  })
})
