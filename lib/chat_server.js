'use strict'

const socketio = require('socket.io')()

const users = {}
let io

function attach (server) {
  io = socketio.attach(server)

  io.on('connection', (socket) => {
    handleJoining(socket)
    handleMsgBroadcasting(socket)
    handleQuitting(socket)
  })
}

function randomName () {
  const id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5))
        .toUpperCase()
  return id
}

function handleJoining (socket) {
  socket.on('join', (room, nickname) => {
    if (!users[socket.id]) {
      users[socket.id] = {}
    }

    // generate random nickname
    if (!nickname) {
      nickname = randomName()
    }

    // check nickname
    if (occupiedNickname(nickname)) {
      socket.emit('system', `${nickname} is occupied. Use another one.`)
    } else {
      Object.assign(users[socket.id], { nickname })
      socket.emit('system', `You are known as \`${nickname}\` now.`)

      socket.join(room)
      Object.assign(users[socket.id], { room })

      socket.broadcast.to(room).emit('system', `${nickname} in.`)
    }
  })
}

function handleMsgBroadcasting (socket) {
  socket.on('message', (msg) => {
    if (users[socket.id]) {
      const nickname = users[socket.id].nickname
      const room = users[socket.id].room
      io.to(room).emit('message', nickname, msg)
    }
  })
}

function handleQuitting (socket) {
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const nickname = users[socket.id].nickname
      const room = users[socket.id].room

      socket.broadcast.to(room).emit('system', `${nickname} out.`)

      delete users[socket.id]
    }
  })
}

function occupiedNickname (nickname) {
  for (const n of Object.values(users)) {
    if (nickname === n.nickname) {
      return true
    }
  }

  return false
}

module.exports = {
  attach
}
