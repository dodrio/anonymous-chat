'use strict'

const httpServer = require('./lib/http_server')
const chatServer = require('./lib/chat_server')

chatServer.attach(httpServer)

httpServer.listen(3000, () => {
  console.log('listening on *:3000')
})
