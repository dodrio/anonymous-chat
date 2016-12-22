'use strict'

const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const cache = {}

const server = http.createServer(requestHandler)

function requestHandler (req, res) {
  let filePath

  if (req.url === '/') {
    filePath = 'public/index.html'
  } else {
    filePath = `public/${req.url}`
  }

  const absPath = `./${filePath}`
  serveStatic(res, cache, absPath)
}

function send404 (res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  })
  res.write('Error 404: resource not found.')
  res.end()
}

function sendFile (res, filePath, fileContents) {
  res.writeHead(200, {
    'Content-Type': mime.lookup(path.basename(filePath))
  })
  res.write(fileContents)
  res.end()
}

function serveStatic (res, cache, absPath) {
  /**
   * if (cache[absPath]) {
   *   sendFile(res, absPath, cache[absPath])
   * } else {
   */
  fs.readFile(absPath, (err, data) => {
    if (err) {
      send404(res)
    } else {
      cache[absPath] = data
      sendFile(res, absPath, data)
    }
  })
}

module.exports = server
