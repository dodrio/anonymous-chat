'use strict'

const httpServer = require('./lib/http_server')
const chatServer = require('./lib/chat_server')
const name = require('./package.json').name

process.title = name
chatServer.attach(httpServer)

const port = 3000
httpServer.listen(port, () => {
  console.log(`listening on ${port}...`)
})
