'use strict'

const socketio = require('socket.io')()

function attach (server) {
  const io = socketio.attach(server)

  io.on('connection', (socket) => {
    io.emit('sys msg', 'a new user connected')
    console.log('a user connected')

    socket.on('disconnect', () => {
      io.emit('sys msg', 'a new user disconnect')
      console.log('user disconnected')
    })

    socket.on('chat msg', (msg) => {
      io.emit('chat msg', msg)
    })
  })
}

module.exports = {
  attach
}
